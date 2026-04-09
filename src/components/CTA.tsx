import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTA = () => (
  <section className="py-24 md:py-32 bg-background">
    <div className="container mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
          Ready to Transform
          <br />
          <span className="italic font-normal">Your Safari Business?</span>
        </h2>
        <p className="text-muted-foreground font-body text-lg max-w-xl mx-auto mb-8">
          Join hundreds of tour operators already saving time and margin with One.safari.
        </p>
        <Button size="lg" className="text-base gap-2">
          Request Early Access <ArrowRight size={18} />
        </Button>
      </motion.div>
    </div>
  </section>
);

export default CTA;
