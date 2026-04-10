import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SupplierLayout from "@/components/SupplierLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Star, MapPin } from "lucide-react";
import { toast } from "sonner";

const SupplierGuides = () => {
  const [guides, setGuides] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", bio: "", location: "", daily_rate: "", years_experience: "",
    languages: "", specializations: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUserId(session.user.id);
    });
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetchGuides();
  }, [userId]);

  const fetchGuides = async () => {
    const { data } = await supabase.from("guides").select("*").eq("supplier_id", userId).order("created_at", { ascending: false });
    setGuides(data || []);
  };

  const handleAdd = async () => {
    if (!userId) return;
    const { error } = await supabase.from("guides").insert({
      supplier_id: userId,
      name: form.name,
      bio: form.bio,
      location: form.location,
      daily_rate: parseFloat(form.daily_rate) || 0,
      years_experience: parseInt(form.years_experience) || 0,
      languages: form.languages.split(",").map((l) => l.trim()).filter(Boolean),
      specializations: form.specializations.split(",").map((s) => s.trim()).filter(Boolean),
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Guide added!");
      setOpen(false);
      setForm({ name: "", bio: "", location: "", daily_rate: "", years_experience: "", languages: "", specializations: "" });
      fetchGuides();
    }
  };

  return (
    <SupplierLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">My Guides</h2>
            <p className="text-muted-foreground font-body text-sm">{guides.length} guide{guides.length !== 1 ? "s" : ""} listed</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus size={16} /> Add Guide</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-display">Add New Guide</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Guide name" /></div>
                <div><Label>Bio</Label><Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Brief description..." /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Serengeti" /></div>
                  <div><Label>Daily Rate ($)</Label><Input type="number" value={form.daily_rate} onChange={(e) => setForm({ ...form, daily_rate: e.target.value })} placeholder="150" /></div>
                </div>
                <div><Label>Years Experience</Label><Input type="number" value={form.years_experience} onChange={(e) => setForm({ ...form, years_experience: e.target.value })} placeholder="5" /></div>
                <div><Label>Languages (comma-separated)</Label><Input value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} placeholder="English, Swahili" /></div>
                <div><Label>Specializations (comma-separated)</Label><Input value={form.specializations} onChange={(e) => setForm({ ...form, specializations: e.target.value })} placeholder="Big Five, Bird Watching" /></div>
                <Button onClick={handleAdd} className="w-full">Add Guide</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {guides.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground font-body">No guides yet. Add your first guide to get started.</CardContent></Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {guides.map((g) => (
              <Card key={g.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-display font-semibold text-foreground text-lg">{g.name}</h3>
                      {g.location && (
                        <div className="flex items-center gap-1 text-muted-foreground text-sm mt-0.5">
                          <MapPin size={14} /> {g.location}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-accent">
                      <Star size={16} fill="currentColor" /> <span className="text-sm font-medium">{g.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground font-body line-clamp-2 mb-3">{g.bio}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {g.specializations?.map((s: string) => (
                      <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{g.years_experience}+ yrs</span>
                    <span className="font-semibold text-foreground">${g.daily_rate}/day</span>
                  </div>
                  <Badge className="mt-2" variant={g.availability_status === "available" ? "default" : "secondary"}>
                    {g.availability_status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </SupplierLayout>
  );
};

export default SupplierGuides;
