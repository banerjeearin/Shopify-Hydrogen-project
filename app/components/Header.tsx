import {Link} from 'react-router';
import Cart from './Cart';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200 shadow-soft">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-serif font-bold text-primary-600">
            Liimra
          </Link>
          <div className="flex items-center gap-8">
            <Link to="/" className="text-neutral-700 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-neutral-700 hover:text-primary-600 transition-colors">
              Products
            </Link>
            <Link to="/about" className="text-neutral-700 hover:text-primary-600 transition-colors">
              About
            </Link>
            <Cart />
          </div>
        </div>
      </nav>
    </header>
  );
}

