import {useLoaderData, useRouteError, isRouteErrorResponse} from 'react-router';
import type {LoaderFunctionArgs} from 'react-router';
import Layout from '~/components/Layout';
import ProductGrid from '~/components/ProductGrid';
import type {SimpleProduct} from '~/lib/shopify.types';

interface LoaderData {
  products: SimpleProduct[];
  hasNextPage: boolean;
}

export async function loader({request}: LoaderFunctionArgs): Promise<LoaderData> {
  const {fetchProducts} = await import('~/lib/shopify-fetcher');

  try {
    // Get pagination cursor from URL if present
    const url = new URL(request.url);
    const after = url.searchParams.get('after') || undefined;

    const productsData = await fetchProducts(20, after);

    const products: SimpleProduct[] = productsData.edges.map((edge) => ({
      id: edge.node.id,
      handle: edge.node.handle,
      title: edge.node.title,
      price: `${edge.node.priceRange.minVariantPrice.currencyCode} ${edge.node.priceRange.minVariantPrice.amount}`,
      image: edge.node.images.edges[0]?.node.url,
      imageAlt: edge.node.images.edges[0]?.node.altText || undefined,
    }));

    return {
      products,
      hasNextPage: productsData.pageInfo.hasNextPage,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Response('Failed to load products. Please try again later.', {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4 text-red-600">
            {error.status} {error.statusText}
          </h1>
          <p className="text-xl text-neutral-600 mb-8">{error.data}</p>
          <a
            href="/products"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-serif font-bold mb-4 text-red-600">
          Oops! Something went wrong
        </h1>
        <p className="text-xl text-neutral-600 mb-8">
          We're having trouble loading products right now.
        </p>
        <a
          href="/products"
          className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Try Again
        </a>
      </div>
    </Layout>
  );
}

export default function ProductsPage() {
  const {products, hasNextPage} = useLoaderData<typeof loader>();

  return (
    <Layout>
      {products.length === 0 ? (
        <div className="container mx-auto px-4 py-24 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">No Products Available</h2>
          <p className="text-xl text-neutral-600">
            Check back soon for new products!
          </p>
        </div>
      ) : (
        <>
          <ProductGrid products={products} />
          {hasNextPage && (
            <div className="container mx-auto px-4 pb-12 text-center">
              <button className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                Load More Products
              </button>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
