import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai",
    content: "The ragi flour from Liimra is absolutely amazing! The texture and taste remind me of the flour my grandmother used to make. My kids love the ragi rotis now!",
    rating: 5,
    avatar: "PS",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    location: "Delhi",
    content: "As a diabetic, finding low GI foods was crucial. Liimra's millet basket has been a game-changer for my health. Highly recommend to anyone looking for healthy alternatives.",
    rating: 5,
    avatar: "RK",
  },
  {
    id: 3,
    name: "Ananya Patel",
    location: "Bangalore",
    content: "Fresh, authentic, and delivered right to my door. The combo pack is perfect for trying different millets. The jowar flour makes the softest rotis!",
    rating: 5,
    avatar: "AP",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-accent font-medium text-sm uppercase tracking-wider mb-4">
            Testimonials
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Loved by Families Across India
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our customers say about 
            their Liimra experience.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-card rounded-2xl p-6 lg:p-8 shadow-soft border border-border/50 hover:shadow-medium transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Quote Icon */}
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                <Quote className="w-5 h-5 text-accent" />
              </div>

              {/* Content */}
              <p className="text-foreground leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
