import { Activity, Wheat, Zap, Heart, Scale, Dumbbell } from "lucide-react";

const benefits = [
  {
    icon: Activity,
    title: "Low Glycemic",
    description: "Slow energy release keeps blood sugar stable throughout the day.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Wheat,
    title: "Gluten Free",
    description: "Naturally gluten-free grains perfect for celiac and wheat-sensitive diets.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Zap,
    title: "High Fiber",
    description: "Promotes healthy digestion and keeps you feeling full longer.",
    color: "text-forest-light",
    bgColor: "bg-forest-light/10",
  },
  {
    icon: Dumbbell,
    title: "High Protein",
    description: "Essential amino acids to support muscle health and recovery.",
    color: "text-terracotta",
    bgColor: "bg-terracotta/10",
  },
  {
    icon: Scale,
    title: "Low Carb",
    description: "Complex carbohydrates that support weight management goals.",
    color: "text-gold",
    bgColor: "bg-gold/10",
  },
  {
    icon: Heart,
    title: "Heart Healthy",
    description: "Rich in minerals that support cardiovascular wellness.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

const Benefits = () => {
  return (
    <section id="benefits" className="py-20 lg:py-32 bg-primary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-accent font-medium text-sm uppercase tracking-wider mb-4">
            Why Millets?
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Power Packed, Health Booster
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Ancient grains, modern nutrition. Discover why millets are called 
            the superfoods of the future.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="group bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-primary-foreground/10 hover:bg-primary-foreground/15 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-14 h-14 rounded-xl ${benefit.bgColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <benefit.icon className={`w-7 h-7 ${benefit.color}`} />
              </div>
              <h3 className="font-display text-xl font-semibold text-primary-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="text-primary-foreground/70 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
