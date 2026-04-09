const Footer = () => (
  <footer className="py-12 bg-secondary border-t border-border">
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <a href="/" className="font-display text-xl font-bold text-foreground">
        One<span className="text-accent">.</span>safari
      </a>
      <div className="flex gap-6">
        <a href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Privacy</a>
        <a href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Terms</a>
        <a href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Contact</a>
      </div>
      <p className="text-muted-foreground text-xs">© 2026 One.safari. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
