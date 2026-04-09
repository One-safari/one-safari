import { motion } from "framer-motion";

const stats = [
  { value: "500+", label: "Verified Guides" },
  { value: "1,200+", label: "Fleet Vehicles" },
  { value: "35", label: "National Parks" },
  { value: "98%", label: "Booking Success" },
];

const Stats = () => (
  <section id="about" className="py-20 bg-primary">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="text-center"
          >
            <p className="font-display text-3xl md:text-5xl font-bold text-primary-foreground">{s.value}</p>
            <p className="text-primary-foreground/60 font-body text-sm mt-2">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Stats;
