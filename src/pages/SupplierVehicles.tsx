import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SupplierLayout from "@/components/SupplierLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, MapPin, Users as UsersIcon } from "lucide-react";
import { toast } from "sonner";

const SupplierVehicles = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", vehicle_type: "4x4 Land Cruiser", capacity: "6", transmission: "Auto",
    location: "", daily_rate: "", features: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUserId(session.user.id);
    });
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetchVehicles();
  }, [userId]);

  const fetchVehicles = async () => {
    const { data } = await supabase.from("vehicles").select("*").eq("supplier_id", userId).order("created_at", { ascending: false });
    setVehicles(data || []);
  };

  const handleAdd = async () => {
    if (!userId) return;
    const { error } = await supabase.from("vehicles").insert({
      supplier_id: userId,
      name: form.name,
      vehicle_type: form.vehicle_type,
      capacity: parseInt(form.capacity) || 6,
      transmission: form.transmission,
      location: form.location,
      daily_rate: parseFloat(form.daily_rate) || 0,
      features: form.features.split(",").map((f) => f.trim()).filter(Boolean),
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Vehicle added!");
      setOpen(false);
      setForm({ name: "", vehicle_type: "4x4 Land Cruiser", capacity: "6", transmission: "Auto", location: "", daily_rate: "", features: "" });
      fetchVehicles();
    }
  };

  return (
    <SupplierLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">My Vehicles</h2>
            <p className="text-muted-foreground font-body text-sm">{vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""} listed</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus size={16} /> Add Vehicle</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-display">Add New Vehicle</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Safari Cruiser #1" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Type</Label>
                    <Select value={form.vehicle_type} onValueChange={(v) => setForm({ ...form, vehicle_type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4x4 Land Cruiser">4x4 Land Cruiser</SelectItem>
                        <SelectItem value="Safari Van">Safari Van</SelectItem>
                        <SelectItem value="Minibus">Minibus</SelectItem>
                        <SelectItem value="4x4 Jeep">4x4 Jeep</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Transmission</Label>
                    <Select value={form.transmission} onValueChange={(v) => setForm({ ...form, transmission: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Auto">Auto</SelectItem>
                        <SelectItem value="Manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Capacity</Label><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} /></div>
                  <div><Label>Daily Rate ($)</Label><Input type="number" value={form.daily_rate} onChange={(e) => setForm({ ...form, daily_rate: e.target.value })} placeholder="200" /></div>
                </div>
                <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Arusha" /></div>
                <div><Label>Features (comma-separated)</Label><Input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Pop-up roof, Fridge, GPS" /></div>
                <Button onClick={handleAdd} className="w-full">Add Vehicle</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {vehicles.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground font-body">No vehicles yet. Add your first vehicle to get started.</CardContent></Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((v) => (
              <Card key={v.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-display font-semibold text-foreground text-lg">{v.name}</h3>
                      <p className="text-muted-foreground text-sm">{v.vehicle_type}</p>
                    </div>
                    <Badge variant={v.is_available ? "default" : "secondary"}>
                      {v.is_available ? "Available" : "Booked"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><UsersIcon size={14} /> {v.capacity} seats</span>
                    <span>{v.transmission}</span>
                    {v.location && <span className="flex items-center gap-1"><MapPin size={14} /> {v.location}</span>}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {v.features?.map((f: string) => (
                      <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                    ))}
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-foreground">${v.daily_rate}/day</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </SupplierLayout>
  );
};

export default SupplierVehicles;
