import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const fetchUserType = async (userId: string) => {
      const { data } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("user_id", userId)
        .single();
      return data?.user_type || "operator";
    };

    // Set up listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;
        setSession(session);
        setLoading(false);

        if (event === "SIGNED_IN" && session) {
          // Use setTimeout to avoid async in callback causing React issues
          setTimeout(async () => {
            if (!isMounted) return;
            const type = await fetchUserType(session.user.id);
            if (!isMounted) return;
            setUserType(type);
            if (location.pathname === "/auth" || location.pathname === "/") {
              navigate(type === "supplier" ? "/supplier" : "/dashboard", { replace: true });
            }
          }, 0);
        }

        if (event === "SIGNED_OUT") {
          setUserType(null);
          navigate("/", { replace: true });
        }
      }
    );

    // Then get current session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return;
      setSession(session);
      if (session?.user) {
        const type = await fetchUserType(session.user.id);
        if (isMounted) setUserType(type);
      }
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  return { session, loading, userType };
};
