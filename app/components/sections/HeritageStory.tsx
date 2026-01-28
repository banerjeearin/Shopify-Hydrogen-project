import {useRef} from 'react';
import {motion, useScroll, useTransform} from 'framer-motion';

export default function HeritageStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const {scrollYProgress} = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={containerRef} className="relative min-h-screen py-24">
      <div className="container mx-auto px-4">
        <motion.div
          style={{opacity, y}}
          className="space-y-24"
        >
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-5xl font-serif font-bold mb-6">Our Heritage</h2>
            <p className="text-xl text-neutral-600">
              A journey of innovation and excellence in healthcare
            </p>
          </div>

          {[1, 2, 3, 4].map((item, index) => (
            <motion.div
              key={index}
              initial={{opacity: 0, x: index % 2 === 0 ? -50 : 50}}
              whileInView={{opacity: 1, x: 0}}
              viewport={{once: true, margin: '-100px'}}
              transition={{duration: 0.8, delay: index * 0.2}}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}
            >
              <div className="flex-1">
                <div className="aspect-video bg-neutral-200 rounded-lg"></div>
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-serif font-semibold mb-4">
                  Milestone {item}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

