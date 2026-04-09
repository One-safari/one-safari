import { motion } from "framer-motion";
import guideImg from "@/assets/guide.jpg";
import vehicleImg from "@/assets/vehicle.jpg";
import permitsImg from "@/assets/permits.jpg";

const services = [
  {
    title: "Verified Guides",
    description: "Access a vetted network of licensed safari guides across East & Southern Africa. View ratings, specialties, and availability in real time.",
    image: guideImg,
  },
  {
    title: "Fleet Vehicles",
    description: "Book safari-ready 4x4s directly from fleet owners. Transparent pricing, maintenance records, and GPS tracking included.",
    image: vehicleImg,
  },
  {
    title: "Park Permits",
    description: "Secure national park permits instantly. No queues, no brokers — direct allocation from park authorities through our integrated system.",
    image: permitsImg,
  },
];

const Services = () => (
  <section id="services" className="py-24 md:py-32 bg-background">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-accent font-body text-sm uppercase tracking-[0.25em] mb-3">What We Offer</p>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
          Everything You Need,
          <br />
          <span className="italic font-normal">Nothing You Don't</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className="group"
          >
            <div className="overflow-hidden rounded-lg mb-6">
              <img
                src={s.image}
                alt={s.title}
                loading="lazy"
                width={800}
                height={800}
                className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">{s.title}</h3>
            <p className="text-muted-foreground font-body text-sm leading-relaxed">{s.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
