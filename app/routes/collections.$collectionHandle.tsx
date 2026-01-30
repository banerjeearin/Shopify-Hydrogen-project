import {useLoaderData, useRouteError, isRouteErrorResponse} from 'react-router';
import type {LoaderFunctionArgs} from 'react-router';
import Layout from '~/components/Layout';
import ProductGrid from '~/components/ProductGrid';
import {getStorefrontApiUrl, getPublicTokenHeaders, isShopifyConfigured} from '~/lib/shopify.server';
import {COLLECTION_QUERY} from '~/lib/shopify-queries';
import type {SimpleProduct} from '~/lib/shopify.types';

interface LoaderData {
  collection: {
    id: string;
    title: string;
    handle: string;
    description: string | null;
    image: {url: string; altText: string | null} | null;
  };
  products: SimpleProduct[];
  hasNextPage: boolean;
}

export async function loader({params}: LoaderFunctionArgs): Promise<LoaderData> {
  const {collectionHandle} = params;

  if (!collectionHandle) {
    throw new Response('Collection not found', {status: 404});
  }

  if (!isShopifyConfigured()) {
    throw new Response('Store not configured', {status: 500});
  }

  try {
    const response = await fetch(getStorefrontApiUrl(), {
      method: 'POST',
      headers: {
        ...getPublicTokenHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: COLLECTION_QUERY,
        variables: {handle: collectionHandle, first: 50},
      }),
    });

    const json = await response.json();

    if (json.errors) {
      console.error('GraphQL errors:', json.errors);
      throw new Response('Failed to load collection', {status: 500});
    }

    const collection = json.data.collection;

    if (!collection) {
      throw new Response('Collection not found', {status: 404});
    }

    const products: SimpleProduct[] = collection.products.edges.map((edge: any) => ({
      id: edge.node.id,
      handle: edge.node.handle,
      title: edge.node.title,
      price: `${edge.node.priceRange.minVariantPrice.currencyCode} ${edge.node.priceRange.minVariantPrice.amount}`,
      image: edge.node.images.edges[0]?.node.url,
      imageAlt: edge.node.images.edges[0]?.node.altText || undefined,
    }));

    return {
      collection: {
        id: collection.id,
        title: collection.title,
        handle: collection.handle,
        description: collection.description,
        image: collection.image,
      },
      products,
      hasNextPage: collection.products.pageInfo.hasNextPage,
    };
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Error fetching collection:', error);
    throw new Response('Failed to load collection', {status: 500});
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
          href="/collections"
          className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Back to Collections
        </a>
      </div>
    </Layout>
  );
}

export default function CollectionPage() {
  const {collection, products, hasNextPage} = useLoaderData<typeof loader>();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Collection Header */}
        <div className="mb-12 text-center">
          {collection.image && (
            <img
              src={collection.image.url}
              alt={collection.image.altText || collection.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
          <h1 className="text-4xl font-serif font-bold mb-4">{collection.title}</h1>
          {collection.description && (
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">{collection.description}</p>
          )}
        </div>

        {/* Products */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-neutral-600">No products in this collection yet.</p>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}

        {hasNextPage && (
          <div className="text-center mt-8">
            <button className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors">
              Load More Products
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
