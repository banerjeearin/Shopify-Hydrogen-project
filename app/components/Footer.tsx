export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-serif text-xl mb-4">Liimra</h3>
            <p className="text-sm">
              Premium healthcare products with innovative 3D experiences.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-primary-400 transition-colors">Home</a></li>
              <li><a href="/products" className="hover:text-primary-400 transition-colors">Products</a></li>
              <li><a href="/about" className="hover:text-primary-400 transition-colors">About</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <p className="text-sm">www.liimra.in</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-neutral-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Liimra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

