import {useLoaderData} from 'react-router';
import Layout from '~/components/Layout';
import Hero from '~/components/sections/Hero';
import ProductGrid from '~/components/ProductGrid';
import MOAAnimation from '~/components/MOAAnimation';
import ScrollReveal from '~/components/ScrollReveal';

export async function loader(args: {context?: any}) {
  // For now, return empty data - components should handle missing data gracefully
  // In the future, you can fetch data here using args.context?.storefront
  return {
    products: [],
  };
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  
  return (
    <Layout>
      <Hero />
      <ScrollReveal>
        <ProductGrid products={data.products || []} />
      </ScrollReveal>
      <MOAAnimation
        title="How Our Ingredients Work"
        description="Experience the mechanism of action at a cellular level"
      />
    </Layout>
  );
}
