/**
 * Header Component
 * Navigation bar with logo, menu, search, and cart
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, Search, User } from 'lucide-react';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Collections', href: '/collections' },
    { label: 'About', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-forest to-forest-light rounded-full flex items-center justify-center">
              <span className="text-white font-display font-bold text-xl">L</span>
            </div>
            <span className="text-2xl font-display text-forest group-hover:text-forest-light transition-colors">
              Liimra
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-foreground hover:text-forest transition-colors font-medium relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-forest transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button
              className="p-2 hover:bg-sage-light rounded-full transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-foreground" />
            </button>

            {/* User Account */}
            <button
              className="hidden md:block p-2 hover:bg-sage-light rounded-full transition-colors"
              aria-label="Account"
            >
              <User className="w-5 h-5 text-foreground" />
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 hover:bg-sage-light rounded-full transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {/* Cart Count Badge */}
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-terracotta text-white text-xs rounded-full flex items-center justify-center font-semibold">
                0
              </span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 hover:bg-sage-light rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-border animate-fade-in">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-lg text-foreground hover:text-forest transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
