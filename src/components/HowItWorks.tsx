import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Sign Up", desc: "Register your tour operator business and get verified within 24 hours." },
  { num: "02", title: "Browse & Book", desc: "Search guides, vehicles, and permits. Filter by location, date, and budget." },
  { num: "03", title: "Confirm & Pay", desc: "Secure bookings with transparent pricing. No hidden fees, no surprises." },
  { num: "04", title: "Operate", desc: "Manage your safari operations from a single dashboard with real-time updates." },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 md:py-32 bg-secondary">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-accent font-body text-sm uppercase tracking-[0.25em] mb-3">Simple Process</p>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
          From Sign-Up to Safari
          <br />
          <span className="italic font-normal">in Four Steps</span>
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="text-center"
          >
            <span className="font-display text-5xl font-bold text-accent/30">{s.num}</span>
            <h3 className="font-display text-lg font-semibold text-foreground mt-2 mb-2">{s.title}</h3>
            <p className="text-muted-foreground font-body text-sm leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
