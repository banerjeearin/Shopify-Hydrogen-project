import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-millets.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-muted/30" />
      
      {/* Decorative shapes */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>100% Natural & Organic</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.1] mb-6">
              Embrace{" "}
              <span className="text-gradient">Millet Magic</span>{" "}
              in Every Bite
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Discover the ancient wisdom of millets — power-packed superfoods 
              that nourish your body naturally. Low GI, gluten-free, and 
              bursting with nutrients.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="xl" className="group">
                Shop Collection
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl">
                Learn More
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start mt-10 pt-10 border-t border-border/50">
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-foreground">500+</p>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </div>
              <div className="w-px h-10 bg-border hidden sm:block" />
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-foreground">100%</p>
                <p className="text-sm text-muted-foreground">Chakki Fresh</p>
              </div>
              <div className="w-px h-10 bg-border hidden sm:block" />
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-foreground">6+</p>
                <p className="text-sm text-muted-foreground">Millet Varieties</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative z-10">
              <img
                src={heroImage}
                alt="Premium millet grains and flours in wooden bowls"
                className="rounded-3xl shadow-glow w-full object-cover aspect-square lg:aspect-[4/3]"
              />
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-4 shadow-medium border border-border animate-float">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <span className="text-2xl">🌾</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Premium Quality</p>
                  <p className="text-sm text-muted-foreground">Stone-ground fresh</p>
                </div>
              </div>
            </div>

            {/* Background shape */}
            <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] -z-10 rotate-3" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
