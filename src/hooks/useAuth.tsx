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

  const fetchUserType = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("user_id", userId)
      .single();
    return data?.user_type || "operator";
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setLoading(false);

        if (event === "SIGNED_IN" && session) {
          const type = await fetchUserType(session.user.id);
          setUserType(type);

          if (location.pathname === "/auth" || location.pathname === "/") {
            navigate(type === "supplier" ? "/supplier" : "/dashboard", { replace: true });
          }
        }

        if (event === "SIGNED_OUT") {
          setUserType(null);
          navigate("/", { replace: true });
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const type = await fetchUserType(session.user.id);
        setUserType(type);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  return { session, loading, userType };
};
