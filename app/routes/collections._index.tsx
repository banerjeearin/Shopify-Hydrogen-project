import {useLoaderData, useRouteError, isRouteErrorResponse} from 'react-router';
import type {LoaderFunctionArgs} from 'react-router';
import Layout from '~/components/Layout';
import {fetchCollections} from '~/lib/shopify-fetcher.server';

interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string | null;
  image: {
    url: string;
    altText: string | null;
  } | null;
}

interface LoaderData {
  collections: Collection[];
}

export async function loader({request}: LoaderFunctionArgs): Promise<LoaderData> {
  try {
    const collectionsData = await fetchCollections(50);

    const collections: Collection[] = collectionsData.edges.map((edge) => ({
      id: edge.node.id,
      title: edge.node.title,
      handle: edge.node.handle,
      description: edge.node.description,
      image: edge.node.image,
    }));

    return {collections};
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw new Response('Failed to load collections.', {status: 500});
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
          Try Again
        </a>
      </div>
    </Layout>
  );
}

export default function CollectionsPage() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8 text-center">Collections</h1>

        {collections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-neutral-600">No collections available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <a
                key={collection.id}
                href={`/collections/${collection.handle}`}
                className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {collection.image ? (
                  <img
                    src={collection.image.url}
                    alt={collection.image.altText || collection.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-neutral-200 flex items-center justify-center">
                    <span className="text-neutral-400">No Image</span>
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors">
                    {collection.title}
                  </h2>
                  {collection.description && (
                    <p className="text-neutral-600 line-clamp-2">{collection.description}</p>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
