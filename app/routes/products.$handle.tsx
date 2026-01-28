import {useLoaderData, useRouteError, isRouteErrorResponse} from 'react-router';
import type {LoaderFunctionArgs} from 'react-router';
import Layout from '~/components/Layout';
import ProductViewer from '~/components/ProductViewer';
import type {Product} from '~/lib/shopify.types';

interface LoaderData {
  product: Product;
  model3dUrl?: string;
}

export async function loader({params}: LoaderFunctionArgs): Promise<LoaderData> {
  // Dynamic import to avoid bundling server code in client
  const {fetchProduct} = await import('~/lib/shopify-fetcher');

  const {handle} = params;

  if (!handle) {
    throw new Response('Product not found', {status: 404});
  }

  try {
    const product = await fetchProduct(handle);

    if (!product) {
      throw new Response('Product not found', {status: 404});
    }

    // Extract 3D model URL from metafields if available
    const model3dMetafield = product.metafields?.edges.find(
      (edge) => edge.node.namespace === 'custom' && edge.node.key === 'model_3d'
    );
    const model3dUrl = model3dMetafield?.node.value;

    return {
      product,
      model3dUrl,
    };
  } catch (error) {
    console.error('Error fetching product:', error);

    if (error instanceof Response) {
      throw error;
    }

    throw new Response('Failed to load product. Please try again later.', {
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
            {error.status === 404 ? 'Product Not Found' : `${error.status} ${error.statusText}`}
          </h1>
          <p className="text-xl text-neutral-600 mb-8">
            {error.status === 404
              ? "The product you're looking for doesn't exist."
              : error.data}
          </p>
          <a
            href="/products"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Browse All Products
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
          We're having trouble loading this product.
        </p>
        <a
          href="/products"
          className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Browse All Products
        </a>
      </div>
    </Layout>
  );
}

export default function ProductPage() {
  const {product, model3dUrl} = useLoaderData<typeof loader>();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <ProductViewer product={{...product, model3dUrl}} />
      </div>
    </Layout>
  );
}
