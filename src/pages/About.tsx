/**
 * About / Heritage Page
 * Features vertical scrollytelling with parallax effects
 * Showcases Liimra's history, mission, and values
 */

import { Layout } from '@/components/layout/Layout';

export default function About() {
  return (
    <Layout showHeader={false}>
      <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-forest to-forest-light">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-6xl md:text-7xl font-display mb-6 animate-fade-in-up">
            Our Heritage
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            A journey through time, blending ancient Unani wisdom with modern wellness
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Scrollytelling Content - Will implement with Framer Motion */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-32">
            {/* Timeline Item 1 */}
            <div className="flex items-center gap-8">
              <div className="w-24 h-24 rounded-full bg-forest flex-shrink-0 flex items-center justify-center">
                <span className="text-2xl font-display text-white">1</span>
              </div>
              <div>
                <h2 className="text-3xl font-display text-forest mb-4">Our Beginning</h2>
                <p className="text-lg text-muted-foreground">
                  Founded with a vision to bring authentic Unani remedies to modern families.
                </p>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="flex items-center gap-8 flex-row-reverse">
              <div className="w-24 h-24 rounded-full bg-terracotta flex-shrink-0 flex items-center justify-center">
                <span className="text-2xl font-display text-white">2</span>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-display text-forest mb-4">Our Mission</h2>
                <p className="text-lg text-muted-foreground">
                  Preserving traditional healing practices while embracing scientific innovation.
                </p>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="flex items-center gap-8">
              <div className="w-24 h-24 rounded-full bg-gold flex-shrink-0 flex items-center justify-center">
                <span className="text-2xl font-display text-white">3</span>
              </div>
              <div>
                <h2 className="text-3xl font-display text-forest mb-4">Our Values</h2>
                <p className="text-lg text-muted-foreground">
                  Quality, authenticity, and your well-being are at the heart of everything we do.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </Layout>
  );
}
