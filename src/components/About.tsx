import { CheckCircle, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  "100% Chakki Fresh Ground Flour",
  "Sourced from Local Farmers",
  "No Preservatives or Additives",
  "Rich in Essential Nutrients",
  "Traditional Stone Grinding Process",
  "Packed Fresh, Delivered Fast",
];

const About = () => {
  return (
    <section id="about" className="py-20 lg:py-32 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image/Visual Side */}
          <div className="relative">
            <div className="relative bg-primary/5 rounded-3xl p-8 lg:p-12">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-2xl">🌾</span>
                  </div>
                  <p className="font-display text-3xl font-bold text-foreground">6+</p>
                  <p className="text-sm text-muted-foreground">Millet Varieties</p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 mt-8">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <span className="text-2xl">👨‍🌾</span>
                  </div>
                  <p className="font-display text-3xl font-bold text-foreground">50+</p>
                  <p className="text-sm text-muted-foreground">Partner Farmers</p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
                  <div className="w-12 h-12 rounded-xl bg-forest-light/10 flex items-center justify-center mb-4">
                    <span className="text-2xl">🥇</span>
                  </div>
                  <p className="font-display text-3xl font-bold text-foreground">100%</p>
                  <p className="text-sm text-muted-foreground">Natural Quality</p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 mt-8">
                  <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center mb-4">
                    <span className="text-2xl">💚</span>
                  </div>
                  <p className="font-display text-3xl font-bold text-foreground">500+</p>
                  <p className="text-sm text-muted-foreground">Happy Families</p>
                </div>
              </div>

              {/* Decorative leaf */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                <Leaf className="w-10 h-10 text-primary" />
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div>
            <span className="inline-block text-accent font-medium text-sm uppercase tracking-wider mb-4">
              Our Story
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Bringing Back the{" "}
              <span className="text-gradient">Ancient Wisdom</span>{" "}
              of Millets
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              At Liimra Naturals, we believe in the power of traditional grains. 
              Our millets are sourced directly from local farmers who follow 
              sustainable farming practices, ensuring you get the purest, 
              most nutritious flour for your family.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Every pack of Liimra flour is stone-ground fresh using traditional 
              chakki methods, preserving the natural nutrients and authentic taste 
              that modern processing often destroys.
            </p>

            {/* Features List */}
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <Button variant="premium" size="lg">
              Explore Our Story
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
