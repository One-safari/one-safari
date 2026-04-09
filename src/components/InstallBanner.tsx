import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const InstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show in iframe/preview
    try {
      if (window.self !== window.top) return;
    } catch { return; }
    if (window.location.hostname.includes("id-preview--") || window.location.hostname.includes("lovableproject.com")) return;

    // Check if already dismissed this session
    if (sessionStorage.getItem("install-banner-dismissed")) return;

    // Check if already installed (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    // iOS detection
    const ua = navigator.userAgent;
    const isiOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(isiOS);

    if (isiOS) {
      // Show iOS instructions after a delay
      const timer = setTimeout(() => setShowBanner(true), 3000);
      return () => clearTimeout(timer);
    }

    // Android/Chrome: listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowBanner(true), 2000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    sessionStorage.setItem("install-banner-dismissed", "true");
  };

  if (!showBanner || dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-up">
      <div className="container mx-auto max-w-lg">
        <div className="bg-card border border-border rounded-xl shadow-lg p-4 flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Download size={20} className="text-primary-foreground" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-display font-semibold text-foreground text-sm">
              Install One<span className="text-accent">.</span>safari
            </p>
            {isIOS ? (
              <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                Tap the <strong>Share</strong> button, then <strong>"Add to Home Screen"</strong> to install.
              </p>
            ) : (
              <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                Add to your home screen for quick access anytime.
              </p>
            )}

            {!isIOS && deferredPrompt && (
              <Button size="sm" className="mt-2 h-8 text-xs" onClick={handleInstall}>
                Install App
              </Button>
            )}
          </div>

          <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallBanner;
