import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SupplierLayout from "@/components/SupplierLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Car, CalendarDays, DollarSign } from "lucide-react";

const SupplierDashboard = () => {
  const [stats, setStats] = useState({ guides: 0, vehicles: 0, bookings: 0, revenue: 0 });
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUserId(session.user.id);
    });
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchStats = async () => {
      const [g, v, b] = await Promise.all([
        supabase.from("guides").select("id", { count: "exact", head: true }).eq("supplier_id", userId),
        supabase.from("vehicles").select("id", { count: "exact", head: true }).eq("supplier_id", userId),
        supabase.from("bookings").select("total_price, guide_id, vehicle_id, guides!inner(supplier_id)").eq("guides.supplier_id", userId),
      ]);

      const bookingData = b.data || [];
      const totalRevenue = bookingData.reduce((sum, bk) => sum + (bk.total_price || 0), 0);

      setStats({
        guides: g.count ?? 0,
        vehicles: v.count ?? 0,
        bookings: bookingData.length,
        revenue: totalRevenue,
      });
    };
    fetchStats();
  }, [userId]);

  const statCards = [
    { label: "My Guides", value: stats.guides, icon: Users, color: "text-primary" },
    { label: "My Vehicles", value: stats.vehicles, icon: Car, color: "text-accent" },
    { label: "Bookings Received", value: stats.bookings, icon: CalendarDays, color: "text-primary" },
    { label: "Total Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-accent" },
  ];

  return (
    <SupplierLayout>
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Welcome back, Supplier</h2>
          <p className="text-muted-foreground font-body text-sm">Manage your guides, vehicles, and incoming bookings.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-body">{s.label}</p>
                    <p className="text-3xl font-bold font-display text-foreground mt-1">{s.value}</p>
                  </div>
                  <s.icon className={`${s.color} opacity-60`} size={32} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SupplierLayout>
  );
};

export default SupplierDashboard;
