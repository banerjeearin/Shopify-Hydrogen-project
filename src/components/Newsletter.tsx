import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Send } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Thanks for subscribing! Check your inbox for exclusive offers.");
      setEmail("");
    }
  };

  return (
    <section className="py-20 lg:py-32 bg-secondary/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-accent font-medium text-sm uppercase tracking-wider mb-4">
            Stay Connected
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Get Healthy Recipes & Exclusive Offers
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Subscribe to our newsletter for millet recipes, health tips, and 
            exclusive discounts delivered straight to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 px-5 rounded-xl bg-background border-border text-foreground placeholder:text-muted-foreground flex-1"
              required
            />
            <Button type="submit" variant="hero" size="lg" className="shrink-0">
              <Send className="w-4 h-4 mr-2" />
              Subscribe
            </Button>
          </form>

          <p className="text-sm text-muted-foreground mt-4">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
