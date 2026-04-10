import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MapPin, Search } from "lucide-react";

const Guides = () => {
  const [guides, setGuides] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [langFilter, setLangFilter] = useState("all");
  const [specFilter, setSpecFilter] = useState("all");

  useEffect(() => {
    const fetchGuides = async () => {
      const { data } = await supabase.from("guides").select("*").order("rating", { ascending: false });
      setGuides(data || []);
    };
    fetchGuides();
  }, []);

  const allLanguages = [...new Set(guides.flatMap((g) => g.languages))];
  const allSpecs = [...new Set(guides.flatMap((g) => g.specializations))];

  const filtered = guides.filter((g) => {
    if (search && !g.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (langFilter !== "all" && !g.languages.includes(langFilter)) return false;
    if (specFilter !== "all" && !g.specializations.includes(specFilter)) return false;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Find a Safari Guide</h2>
          <p className="text-muted-foreground font-body text-sm">Showing {filtered.length} of {guides.length} verified guides</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={langFilter} onValueChange={setLangFilter}>
            <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Language" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {allLanguages.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={specFilter} onValueChange={setSpecFilter}>
            <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Specialization" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specializations</SelectItem>
              {allSpecs.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((g) => (
            <Card key={g.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display font-semibold text-foreground text-lg">{g.name}</h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm mt-0.5">
                      <MapPin size={14} /> {g.location}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-accent">
                    <Star size={16} fill="currentColor" /> <span className="text-sm font-medium">{g.rating}</span>
                    <span className="text-muted-foreground text-xs">({g.review_count})</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-body line-clamp-2 mb-3">{g.bio}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {g.specializations.map((s: string) => (
                    <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{g.years_experience}+ yrs · {g.languages.join(", ")}</span>
                  <span className="font-semibold text-foreground">${g.daily_rate}/day</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Guides;
