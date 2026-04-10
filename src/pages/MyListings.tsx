import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Upload, Trash2, MapPin, Star } from "lucide-react";

const MyListings = () => {
  const [guides, setGuides] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [guideDialogOpen, setGuideDialogOpen] = useState(false);
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
        fetchListings(session.user.id);
      }
    });
  }, []);

  const fetchListings = async (uid: string) => {
    const [g, v] = await Promise.all([
      supabase.from("guides").select("*").eq("supplier_id", uid),
      supabase.from("vehicles").select("*").eq("supplier_id", uid),
    ]);
    setGuides(g.data || []);
    setVehicles(v.data || []);
  };

  const uploadPhoto = async (file: File, folder: string): Promise<string | null> => {
    if (!userId) return null;
    const ext = file.name.split(".").pop();
    const path = `${userId}/${folder}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("safari-assets").upload(path, file);
    if (error) {
      toast.error("Upload failed: " + error.message);
      return null;
    }
    const { data } = supabase.storage.from("safari-assets").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleDeleteGuide = async (id: string) => {
    await supabase.from("guides").delete().eq("id", id);
    if (userId) fetchListings(userId);
    toast.success("Guide removed");
  };

  const handleDeleteVehicle = async (id: string) => {
    await supabase.from("vehicles").delete().eq("id", id);
    if (userId) fetchListings(userId);
    toast.success("Vehicle removed");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">My Listings</h2>
          <p className="text-muted-foreground font-body text-sm">Manage your guides and vehicles as a supplier.</p>
        </div>

        <Tabs defaultValue="guides">
          <TabsList>
            <TabsTrigger value="guides">Guides ({guides.length})</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles ({vehicles.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="guides" className="space-y-4 mt-4">
            <Dialog open={guideDialogOpen} onOpenChange={setGuideDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2"><Plus size={16} /> Add Guide</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle className="font-display">Add New Guide</DialogTitle></DialogHeader>
                <GuideForm
                  userId={userId}
                  uploadPhoto={uploadPhoto}
                  onSaved={() => {
                    setGuideDialogOpen(false);
                    if (userId) fetchListings(userId);
                  }}
                />
              </DialogContent>
            </Dialog>

            {guides.length === 0 ? (
              <p className="text-muted-foreground text-sm">You haven't added any guides yet.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {guides.map((g) => (
                  <Card key={g.id}>
                    <CardContent className="pt-6">
                      {g.photo_url && (
                        <img src={g.photo_url} alt={g.name} className="w-full h-40 object-cover rounded-md mb-3" />
                      )}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-display font-semibold text-foreground">{g.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin size={12} /> {g.location}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteGuide(g.id)}>
                          <Trash2 size={16} className="text-destructive" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {g.specializations?.map((s: string) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                      </div>
                      <p className="text-sm font-semibold text-foreground mt-2">${g.daily_rate}/day</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="vehicles" className="space-y-4 mt-4">
            <Dialog open={vehicleDialogOpen} onOpenChange={setVehicleDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2"><Plus size={16} /> Add Vehicle</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle className="font-display">Add New Vehicle</DialogTitle></DialogHeader>
                <VehicleForm
                  userId={userId}
                  uploadPhoto={uploadPhoto}
                  onSaved={() => {
                    setVehicleDialogOpen(false);
                    if (userId) fetchListings(userId);
                  }}
                />
              </DialogContent>
            </Dialog>

            {vehicles.length === 0 ? (
              <p className="text-muted-foreground text-sm">You haven't added any vehicles yet.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehicles.map((v) => (
                  <Card key={v.id}>
                    <CardContent className="pt-6">
                      {v.photo_url && (
                        <img src={v.photo_url} alt={v.name} className="w-full h-40 object-cover rounded-md mb-3" />
                      )}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-display font-semibold text-foreground">{v.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin size={12} /> {v.location}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteVehicle(v.id)}>
                          <Trash2 size={16} className="text-destructive" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {v.features?.map((f: string) => <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>)}
                      </div>
                      <p className="text-sm font-semibold text-foreground mt-2">${v.daily_rate}/day</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

const GuideForm = ({ userId, uploadPhoto, onSaved }: { userId: string | null; uploadPhoto: (f: File, folder: string) => Promise<string | null>; onSaved: () => void }) => {
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "", bio: "", years_experience: 0, languages: "", specializations: "",
    daily_rate: 0, location: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    try {
      let photo_url: string | null = null;
      if (photoFile) photo_url = await uploadPhoto(photoFile, "guides");

      const { error } = await supabase.from("guides").insert({
        supplier_id: userId,
        name: form.name,
        bio: form.bio,
        years_experience: form.years_experience,
        languages: form.languages.split(",").map((l) => l.trim()).filter(Boolean),
        specializations: form.specializations.split(",").map((s) => s.trim()).filter(Boolean),
        daily_rate: form.daily_rate,
        location: form.location,
        photo_url,
      });
      if (error) throw error;
      toast.success("Guide added!");
      onSaved();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Photo</Label>
        <div className="mt-1">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} />
          <Button type="button" variant="outline" className="gap-2" onClick={() => fileRef.current?.click()}>
            <Upload size={16} /> {photoFile ? photoFile.name : "Choose photo"}
          </Button>
        </div>
      </div>
      <div><Label>Name *</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
      <div><Label>Bio</Label><Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Years Experience</Label><Input type="number" min={0} value={form.years_experience} onChange={(e) => setForm({ ...form, years_experience: parseInt(e.target.value) || 0 })} /></div>
        <div><Label>Daily Rate ($)</Label><Input type="number" min={0} value={form.daily_rate} onChange={(e) => setForm({ ...form, daily_rate: parseFloat(e.target.value) || 0 })} /></div>
      </div>
      <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Serengeti" /></div>
      <div><Label>Languages (comma-separated)</Label><Input value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} placeholder="English, Swahili" /></div>
      <div><Label>Specializations (comma-separated)</Label><Input value={form.specializations} onChange={(e) => setForm({ ...form, specializations: e.target.value })} placeholder="Photography, Walking Safaris" /></div>
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Saving..." : "Add Guide"}</Button>
    </form>
  );
};

const VehicleForm = ({ userId, uploadPhoto, onSaved }: { userId: string | null; uploadPhoto: (f: File, folder: string) => Promise<string | null>; onSaved: () => void }) => {
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "", vehicle_type: "4x4 Land Cruiser", capacity: 6, transmission: "Auto",
    location: "", daily_rate: 0, features: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    try {
      let photo_url: string | null = null;
      if (photoFile) photo_url = await uploadPhoto(photoFile, "vehicles");

      const { error } = await supabase.from("vehicles").insert({
        supplier_id: userId,
        name: form.name,
        vehicle_type: form.vehicle_type,
        capacity: form.capacity,
        transmission: form.transmission,
        location: form.location,
        daily_rate: form.daily_rate,
        features: form.features.split(",").map((f) => f.trim()).filter(Boolean),
        photo_url,
      });
      if (error) throw error;
      toast.success("Vehicle added!");
      onSaved();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Photo</Label>
        <div className="mt-1">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} />
          <Button type="button" variant="outline" className="gap-2" onClick={() => fileRef.current?.click()}>
            <Upload size={16} /> {photoFile ? photoFile.name : "Choose photo"}
          </Button>
        </div>
      </div>
      <div><Label>Vehicle Name *</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Toyota Land Cruiser 78" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Type</Label>
          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.vehicle_type} onChange={(e) => setForm({ ...form, vehicle_type: e.target.value })}>
            <option>4x4 Land Cruiser</option>
            <option>4x4 Land Rover</option>
            <option>Safari Van</option>
            <option>Open-sided</option>
          </select>
        </div>
        <div>
          <Label>Transmission</Label>
          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })}>
            <option>Auto</option>
            <option>Manual</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Capacity</Label><Input type="number" min={1} max={20} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 6 })} /></div>
        <div><Label>Daily Rate ($)</Label><Input type="number" min={0} value={form.daily_rate} onChange={(e) => setForm({ ...form, daily_rate: parseFloat(e.target.value) || 0 })} /></div>
      </div>
      <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Maasai Mara" /></div>
      <div><Label>Features (comma-separated)</Label><Input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Pop-up Roof, A/C, Fridge" /></div>
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Saving..." : "Add Vehicle"}</Button>
    </form>
  );
};

export default MyListings;
