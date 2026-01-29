import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import {useNonce} from '@shopify/hydrogen';
import {CartProvider} from '~/lib/cart-context';
import stylesheet from '~/styles/app.css?url';

export function links() {
  return [
    {rel: 'stylesheet', href: stylesheet as string},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap',
    },
  ];
}

export async function loader(args: {context?: any}) {
  // Initialize Hydrogen context - return minimal data for now
  // The context is provided by Hydrogen's dev server
  return {
    // Return empty object - components should handle missing data gracefully
  };
}

export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Outlet />
    </CartProvider>
  );
}
