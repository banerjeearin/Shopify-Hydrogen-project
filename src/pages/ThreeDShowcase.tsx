/**
 * 3D Showcase Page
 * Demonstrates all 3D interactive components
 */

import { Layout } from '@/components/layout/Layout';
import { ProductViewer3D } from '@/components/3d/ProductViewer3D';
import { HeroScene3D } from '@/components/3d/HeroScene3D';
import { ParallaxCard } from '@/components/3d/ParallaxCard';
import { ScrollReveal, ScrollStagger } from '@/components/animations/ScrollReveal';

export default function ThreeDShowcase() {
  return (
    <Layout>
      {/* Hero with 3D Scene */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-cream via-sage-light to-cream overflow-hidden">
        <HeroScene3D height="100vh" interactive />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center z-10">
            <ScrollReveal variant="fadeUp">
              <h1 className="text-6xl md:text-8xl font-display text-forest mb-6">
                3D Interactive
                <br />
                <span className="text-gradient">Experience</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal variant="fadeUp" delay={0.2}>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Immersive product visualization meets premium design
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 360° Product Viewer Demo */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal variant="fadeUp">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-display text-forest mb-4">
                360° Product Viewer
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Interactive 3D model with drag-to-rotate and zoom controls
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="scaleIn" delay={0.3}>
            <div className="max-w-4xl mx-auto">
              <ProductViewer3D
                autoRotate={true}
                autoRotateSpeed={0.8}
                enableZoom={true}
                productColor="#2d5a3d"
                height="600px"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fadeUp" delay={0.5}>
            <div className="mt-12 text-center">
              <p className="text-muted-foreground">
                ⚡ Built with Three.js & React Three Fiber<br />
                🎨 Realistic lighting & shadows<br />
                📱 Touch-friendly for mobile devices
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Parallax Cards Demo */}
      <section className="py-24 bg-gradient-to-br from-sage-light to-cream">
        <div className="container mx-auto px-4">
          <ScrollReveal variant="fadeUp">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-display text-forest mb-4">
                Hover-Parallax Effects
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Interactive depth on mouse movement
              </p>
            </div>
          </ScrollReveal>

          <ScrollStagger staggerDelay={0.15}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                { title: 'Herbal Remedies', color: 'from-forest to-forest-light', emoji: '🌿' },
                { title: 'Millet Products', color: 'from-terracotta to-terracotta-light', emoji: '🌾' },
                { title: 'Wellness Essentials', color: 'from-sage to-sage-light', emoji: '✨' }
              ].map((item, index) => (
                <ParallaxCard
                  key={index}
                  intensity={0.7}
                  glare={true}
                  className="transform transition-all duration-300 hover:scale-105"
                >
                  <div className={`bg-gradient-to-br ${item.color} rounded-xl p-8 shadow-medium h-80 flex flex-col items-center justify-center text-white`}>
                    <div className="text-7xl mb-4">{item.emoji}</div>
                    <h3 className="text-3xl font-display text-center">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-cream opacity-90 text-center">
                      Hover to interact →
                    </p>
                  </div>
                </ParallaxCard>
              ))}
            </div>
          </ScrollStagger>
        </div>
      </section>

      {/* Scroll Reveal Demo */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal variant="fadeUp">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-display text-forest mb-4">
                Scroll-Triggered Animations
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Smooth reveals as you scroll down the page
              </p>
            </div>
          </ScrollReveal>

          <div className="max-w-4xl mx-auto space-y-12">
            <ScrollReveal variant="fadeLeft">
              <div className="bg-gradient-to-r from-forest to-forest-light rounded-xl p-8 text-white">
                <h3 className="text-3xl font-display mb-4">← Fade from Left</h3>
                <p className="text-cream">Perfect for alternating content sections</p>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fadeRight">
              <div className="bg-gradient-to-r from-terracotta to-terracotta-light rounded-xl p-8 text-white">
                <h3 className="text-3xl font-display mb-4">Fade from Right →</h3>
                <p className="text-cream">Creates dynamic storytelling flow</p>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="scaleIn">
              <div className="bg-gradient-to-br from-sage to-sage-light rounded-xl p-8 text-white text-center">
                <h3 className="text-3xl font-display mb-4">⚡ Scale In</h3>
                <p className="text-cream">Draws attention to key elements</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 bg-forest text-white">
        <div className="container mx-auto px-4">
          <ScrollReveal variant="fadeUp">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-display mb-4">
                Built for Performance
              </h2>
              <p className="text-xl text-cream/80 max-w-2xl mx-auto">
                Optimized 3D rendering with modern web technologies
              </p>
            </div>
          </ScrollReveal>

          <ScrollStagger staggerDelay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { icon: '🚀', title: 'Lazy Loading', desc: 'Load 3D assets on demand' },
                { icon: '📱', title: 'Mobile Optimized', desc: 'Touch gestures supported' },
                { icon: '⚡', title: 'GPU Accelerated', desc: 'Smooth 60fps animations' },
                { icon: '🎨', title: 'Customizable', desc: 'Easy color & style control' }
              ].map((feature, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-display mb-2">{feature.title}</h3>
                  <p className="text-cream/70 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </ScrollStagger>
        </div>
      </section>
    </Layout>
  );
}
