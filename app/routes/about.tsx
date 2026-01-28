import {useLoaderData} from 'react-router';
import Layout from '~/components/Layout';
import HeritageStory from '~/components/sections/HeritageStory';

export async function loader(args: {context?: any}) {
  return {};
}

export default function About() {
  const data = useLoaderData<typeof loader>();
  
  return (
    <Layout>
      <HeritageStory />
    </Layout>
  );
}
