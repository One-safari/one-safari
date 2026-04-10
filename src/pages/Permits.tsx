import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Ticket } from "lucide-react";

const Permits = () => {
  const [permits, setPermits] = useState<any[]>([]);
  const [countryFilter, setCountryFilter] = useState("all");

  useEffect(() => {
    const fetchPermits = async () => {
      const { data } = await supabase.from("permits").select("*").order("park_name");
      setPermits(data || []);
    };
    fetchPermits();
  }, []);

  const allCountries = [...new Set(permits.map((p) => p.country))];

  const filtered = permits.filter((p) => {
    if (countryFilter !== "all" && p.country !== countryFilter) return false;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Park Permits</h2>
          <p className="text-muted-foreground font-body text-sm">Secure national park permits instantly. No queues, no brokers.</p>
        </div>

        <div className="flex gap-3">
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Country" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {allCountries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <Card key={p.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-display font-semibold text-foreground text-lg">{p.park_name}</h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm mt-0.5">
                      <MapPin size={14} /> {p.country}
                    </div>
                  </div>
                  <Ticket className="text-accent opacity-60" size={24} />
                </div>
                <p className="text-sm text-muted-foreground font-body my-3">{p.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary">{p.permit_type}</Badge>
                  <span className="text-sm text-muted-foreground">{p.available_slots} slots available</span>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="text-2xl font-bold text-foreground font-display">${p.price}</span>
                  <span className="text-sm text-muted-foreground">/person</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Permits;
