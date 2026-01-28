import {useLoaderData} from 'react-router';
import Layout from '~/components/Layout';
import ProductGrid from '~/components/ProductGrid';
import {fetchProducts} from '~/lib/shopify-fetcher';

export async function loader(args: {context?: any}) {
  try {
    // Use the storefront client from context if available, otherwise fallback to direct fetch
    const productsData = await fetchProducts(20);
    const products = productsData.edges.map((edge: any) => ({
      id: edge.node.id,
      handle: edge.node.handle,
      title: edge.node.title,
      price: `${edge.node.priceRange.minVariantPrice.currencyCode} ${edge.node.priceRange.minVariantPrice.amount}`,
      image: edge.node.images.edges[0]?.node.url,
    }));
    return {products};
  } catch (error) {
    console.error('Error fetching products:', error);
    return {products: []};
  }
}

export default function ProductsPage() {
  const {products} = useLoaderData<typeof loader>();
  
  return (
    <Layout>
      <ProductGrid products={products} />
    </Layout>
  );
}
