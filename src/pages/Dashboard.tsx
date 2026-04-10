import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Car, FileText, CalendarDays } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({ guides: 0, vehicles: 0, permits: 0, bookings: 0 });
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [g, v, p, b] = await Promise.all([
        supabase.from("guides").select("id", { count: "exact", head: true }),
        supabase.from("vehicles").select("id", { count: "exact", head: true }),
        supabase.from("permits").select("id", { count: "exact", head: true }),
        supabase.from("bookings").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        guides: g.count ?? 0,
        vehicles: v.count ?? 0,
        permits: p.count ?? 0,
        bookings: b.count ?? 0,
      });
    };

    const fetchBookings = async () => {
      const { data } = await supabase
        .from("bookings")
        .select("*, guides(name), vehicles(name)")
        .order("start_date", { ascending: true })
        .limit(5);
      setBookings(data || []);
    };

    fetchStats();
    fetchBookings();
  }, []);

  const statCards = [
    { label: "Available Guides", value: stats.guides, icon: Users, color: "text-primary" },
    { label: "Fleet Vehicles", value: stats.vehicles, icon: Car, color: "text-accent" },
    { label: "Park Permits", value: stats.permits, icon: FileText, color: "text-primary" },
    { label: "Your Bookings", value: stats.bookings, icon: CalendarDays, color: "text-accent" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Welcome back, Operator</h2>
          <p className="text-muted-foreground font-body text-sm">Here's what's happening today.</p>
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

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Upcoming Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-muted-foreground text-sm font-body">No bookings yet. Browse guides, vehicles, and permits to create your first safari.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-2 text-muted-foreground font-medium">Dates</th>
                      <th className="pb-2 text-muted-foreground font-medium">Guide</th>
                      <th className="pb-2 text-muted-foreground font-medium">Vehicle</th>
                      <th className="pb-2 text-muted-foreground font-medium">Status</th>
                      <th className="pb-2 text-muted-foreground font-medium text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} className="border-b border-border last:border-0">
                        <td className="py-3 text-foreground">{b.start_date} — {b.end_date}</td>
                        <td className="py-3 text-foreground">{b.guides?.name || "—"}</td>
                        <td className="py-3 text-foreground">{b.vehicles?.name || "—"}</td>
                        <td className="py-3"><Badge variant={b.status === "confirmed" ? "default" : "secondary"}>{b.status}</Badge></td>
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
    </DashboardLayout>
  );
};

export default Dashboard;
