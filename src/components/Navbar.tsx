import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <a href="/" className="font-display text-2xl font-bold tracking-tight text-foreground">
          One<span className="text-accent">.</span>safari
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Services</a>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</a>
          <Button size="sm">Get Started</Button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 flex flex-col gap-3">
          <a href="#services" className="text-sm font-medium text-muted-foreground py-2">Services</a>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground py-2">How It Works</a>
          <a href="#about" className="text-sm font-medium text-muted-foreground py-2">About</a>
          <Button size="sm" className="w-fit">Get Started</Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
