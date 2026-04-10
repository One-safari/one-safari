import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Users, Car } from "lucide-react";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [sortBy, setSortBy] = useState("price-asc");

  useEffect(() => {
    const fetchVehicles = async () => {
      const { data } = await supabase.from("vehicles").select("*").eq("is_available", true);
      setVehicles(data || []);
    };
    fetchVehicles();
  }, []);

  const allTypes = [...new Set(vehicles.map((v) => v.vehicle_type))];
  const allLocations = [...new Set(vehicles.map((v) => v.location).filter(Boolean))];

  const filtered = vehicles
    .filter((v) => {
      if (search && !v.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter !== "all" && v.vehicle_type !== typeFilter) return false;
      if (locationFilter !== "all" && v.location !== locationFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.daily_rate - b.daily_rate;
      if (sortBy === "price-desc") return b.daily_rate - a.daily_rate;
      if (sortBy === "capacity") return b.capacity - a.capacity;
      return 0;
    });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Vehicle Listings</h2>
          <p className="text-muted-foreground font-body text-sm">Showing {filtered.length} of {vehicles.length} vehicles</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input placeholder="Search vehicles..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[170px]"><SelectValue placeholder="Car Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {allTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Location" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {allLocations.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Sort" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Price: Low → High</SelectItem>
              <SelectItem value="price-desc">Price: High → Low</SelectItem>
              <SelectItem value="capacity">Capacity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((v) => (
            <Card key={v.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-display font-semibold text-foreground text-lg">{v.name}</h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm mt-0.5">
                      <MapPin size={14} /> {v.location}
                    </div>
                  </div>
                  <Car className="text-accent opacity-60" size={24} />
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground my-3">
                  <span className="flex items-center gap-1"><Users size={14} /> {v.capacity} seats</span>
                  <span>{v.transmission}</span>
                  <span>{v.vehicle_type}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {v.features.map((f: string) => (
                    <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="text-2xl font-bold text-foreground font-display">${v.daily_rate}</span>
                  <span className="text-sm text-muted-foreground">/day</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Vehicles;
