import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-safari.jpg";

const Hero = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0">
      <img src={heroImage} alt="African savanna at golden hour" width={1920} height={1080} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-foreground/50" />
    </div>

    <div className="relative z-10 container mx-auto px-4 text-center">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-primary-foreground/80 font-body text-sm uppercase tracking-[0.3em] mb-6"
      >
        The B2B Safari Marketplace
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-primary-foreground leading-[1.1] max-w-4xl mx-auto mb-6"
      >
        Cut the Middlemen.
        <br />
        <span className="italic font-normal">Own the Safari.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="text-primary-foreground/70 font-body text-lg md:text-xl max-w-2xl mx-auto mb-10"
      >
        Direct access to verified guides, vehicles & park permits — built for tour operators who demand transparency and margin.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button size="lg" className="text-base gap-2">
          Request Access <ArrowRight size={18} />
        </Button>
        <Button size="lg" variant="outline" className="text-base border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10">
          See How It Works
        </Button>
      </motion.div>
    </div>
  </section>
);

export default Hero;
