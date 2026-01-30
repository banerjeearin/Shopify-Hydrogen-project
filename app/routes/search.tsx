import {useLoaderData, useRouteError, isRouteErrorResponse} from 'react-router';
import type {LoaderFunctionArgs} from 'react-router';
import Layout from '~/components/Layout';
import ProductGrid from '~/components/ProductGrid';
import {getStorefrontApiUrl, getPublicTokenHeaders, isShopifyConfigured} from '~/lib/shopify.server';
import {SEARCH_QUERY} from '~/lib/shopify-queries';
import type {SimpleProduct} from '~/lib/shopify.types';

interface LoaderData {
  query: string;
  products: SimpleProduct[];
  hasNextPage: boolean;
}

export async function loader({request}: LoaderFunctionArgs): Promise<LoaderData> {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';

  if (!query) {
    return {query: '', products: [], hasNextPage: false};
  }

  if (!isShopifyConfigured()) {
    return {query, products: [], hasNextPage: false};
  }

  try {
    const response = await fetch(getStorefrontApiUrl(), {
      method: 'POST',
      headers: {
        ...getPublicTokenHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: SEARCH_QUERY,
        variables: {query, first: 24},
      }),
    });

    const json = await response.json();

    if (json.errors) {
      console.error('GraphQL errors:', json.errors);
      return {query, products: [], hasNextPage: false};
    }

    const productsData = json.data.products;

    const products: SimpleProduct[] = productsData.edges.map((edge: any) => ({
      id: edge.node.id,
      handle: edge.node.handle,
      title: edge.node.title,
      price: `${edge.node.priceRange.minVariantPrice.currencyCode} ${edge.node.priceRange.minVariantPrice.amount}`,
      image: edge.node.images.edges[0]?.node.url,
      imageAlt: edge.node.images.edges[0]?.node.altText || undefined,
    }));

    return {
      query,
      products,
      hasNextPage: productsData.pageInfo.hasNextPage,
    };
  } catch (error) {
    console.error('Error searching products:', error);
    return {query, products: [], hasNextPage: false};
  }
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-serif font-bold mb-4 text-red-600">
          {isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : 'Error'}
        </h1>
        <p className="text-xl text-neutral-600 mb-8">
          {isRouteErrorResponse(error) ? error.data : 'Something went wrong'}
        </p>
        <a
          href="/search"
          className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Try Again
        </a>
      </div>
    </Layout>
  );
}

export default function SearchPage() {
  const {query, products, hasNextPage} = useLoaderData<typeof loader>();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-serif font-bold mb-8 text-center">Search</h1>
          <form method="get" className="flex gap-4">
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search products..."
              className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Results */}
        {query && (
          <div>
            <p className="text-neutral-600 mb-6">
              {products.length === 0
                ? `No results found for "${query}"`
                : `Showing ${products.length} result${products.length === 1 ? '' : 's'} for "${query}"`}
            </p>

            {products.length > 0 && (
              <>
                <ProductGrid products={products} />
                {hasNextPage && (
                  <div className="text-center mt-8">
                    <button className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {!query && (
          <div className="text-center py-12">
            <p className="text-xl text-neutral-600">Enter a search term to find products.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
