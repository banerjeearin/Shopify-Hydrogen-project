/**
 * Footer Component
 * Site footer with links, newsletter, and social media
 */

import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { label: 'All Products', href: '/products' },
      { label: 'Collections', href: '/collections' },
      { label: 'New Arrivals', href: '/collections/new' },
      { label: 'Best Sellers', href: '/collections/best-sellers' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Story', href: '/about#story' },
      { label: 'Contact', href: '/contact' },
      { label: 'Blog', href: '/blog' },
    ],
    support: [
      { label: 'FAQs', href: '/faqs' },
      { label: 'Shipping', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  };

  return (
    <footer className="bg-gradient-to-br from-forest to-forest-light text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-forest font-display font-bold text-2xl">L</span>
              </div>
              <span className="text-3xl font-display">Liimra</span>
            </Link>
            <p className="text-white/80 mb-6 max-w-md">
              Premium Unani herbal remedies and organic wellness products, crafted with care and backed by tradition.
            </p>

            {/* Newsletter */}
            <div className="space-y-3">
              <p className="font-medium">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-white/40 transition-colors"
                />
                <button className="px-6 py-2 bg-terracotta hover:bg-terracotta-light text-white rounded-lg font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-display text-xl mb-4">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-display text-xl mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-display text-xl mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-white/70 text-sm">
              © {currentYear} Liimra. All rights reserved.
            </p>

            {/* Social Media */}
            <div className="flex items-center space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:info@liimra.in"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>

            {/* Payment Icons / Certifications */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/70">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
