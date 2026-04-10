import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SupplierLayout from "@/components/SupplierLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SupplierBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUserId(session.user.id);
    });
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchBookings = async () => {
      // Get bookings where the guide or vehicle belongs to this supplier
      const { data } = await supabase
        .from("bookings")
        .select("*, guides!inner(name, supplier_id), vehicles(name)")
        .eq("guides.supplier_id", userId)
        .order("start_date", { ascending: false });
      setBookings(data || []);
    };
    fetchBookings();
  }, [userId]);

  const statusColor = (s: string) => {
    switch (s) {
      case "confirmed": return "default";
      case "pending": return "secondary";
      case "completed": return "outline";
      default: return "destructive";
    }
  };

  return (
    <SupplierLayout>
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Incoming Bookings</h2>
          <p className="text-muted-foreground font-body text-sm">Bookings from operators using your guides and vehicles.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">All Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-muted-foreground text-sm font-body py-8 text-center">
                No bookings yet. Once operators book your guides or vehicles, they'll appear here.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-2 text-muted-foreground font-medium">Dates</th>
                      <th className="pb-2 text-muted-foreground font-medium">Guide</th>
                      <th className="pb-2 text-muted-foreground font-medium">Vehicle</th>
                      <th className="pb-2 text-muted-foreground font-medium">Status</th>
                      <th className="pb-2 text-muted-foreground font-medium text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} className="border-b border-border last:border-0">
                        <td className="py-3 text-foreground">{b.start_date} — {b.end_date}</td>
                        <td className="py-3 text-foreground">{b.guides?.name || "—"}</td>
                        <td className="py-3 text-foreground">{b.vehicles?.name || "—"}</td>
                        <td className="py-3"><Badge variant={statusColor(b.status) as any}>{b.status}</Badge></td>
                        <td className="py-3 text-foreground text-right font-medium">${b.total_price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SupplierLayout>
  );
};

export default SupplierBookings;
