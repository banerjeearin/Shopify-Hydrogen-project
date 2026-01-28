import {useLoaderData} from 'react-router';
import Layout from '~/components/Layout';
import ProductViewer from '~/components/ProductViewer';
import {fetchProduct} from '~/lib/shopify-fetcher';

export async function loader(args: {params?: {handle?: string}}) {
  const {handle} = args.params || {};
  
  if (!handle) {
    throw new Response('Product not found', {status: 404});
  }

  try {
    const product = await fetchProduct(handle);
    return {product};
  } catch (error) {
    console.error('Error fetching product:', error);
    // Fallback for development
    return {
      product: {
        handle,
        title: 'Product Title',
        description: 'Product description',
      },
    };
  }
}

export default function ProductPage() {
  const {product} = useLoaderData<typeof loader>();
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <ProductViewer product={product} />
      </div>
    </Layout>
  );
}
