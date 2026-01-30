import type {LoaderFunctionArgs} from 'react-router';
import {getStorefrontApiUrl, getPublicTokenHeaders, isShopifyConfigured} from '~/lib/shopify.server';
import {SITEMAP_QUERY} from '~/lib/shopify-queries';

export async function loader({request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  if (!isShopifyConfigured()) {
    // Return a minimal sitemap if not configured
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <priority>1.0</priority>
  </url>
</urlset>`;
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  try {
    const response = await fetch(getStorefrontApiUrl(), {
      method: 'POST',
      headers: {
        ...getPublicTokenHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query: SITEMAP_QUERY}),
    });

    const json = await response.json();

    if (json.errors) {
      console.error('Sitemap GraphQL errors:', json.errors);
    }

    const products = json.data?.products?.edges || [];
    const collections = json.data?.collections?.edges || [];
    const pages = json.data?.pages?.edges || [];

    const urls: string[] = [];

    // Add homepage
    urls.push(`
  <url>
    <loc>${baseUrl}/</loc>
    <priority>1.0</priority>
  </url>`);

    // Add static pages
    urls.push(`
  <url>
    <loc>${baseUrl}/products</loc>
    <priority>0.9</priority>
  </url>`);

    urls.push(`
  <url>
    <loc>${baseUrl}/collections</loc>
    <priority>0.9</priority>
  </url>`);

    urls.push(`
  <url>
    <loc>${baseUrl}/search</loc>
    <priority>0.7</priority>
  </url>`);

    // Add products
    for (const {node} of products) {
      urls.push(`
  <url>
    <loc>${baseUrl}/products/${node.handle}</loc>
    <lastmod>${node.updatedAt}</lastmod>
    <priority>0.8</priority>
  </url>`);
    }

    // Add collections
    for (const {node} of collections) {
      urls.push(`
  <url>
    <loc>${baseUrl}/collections/${node.handle}</loc>
    <lastmod>${node.updatedAt}</lastmod>
    <priority>0.8</priority>
  </url>`);
    }

    // Add pages
    for (const {node} of pages) {
      urls.push(`
  <url>
    <loc>${baseUrl}/pages/${node.handle}</loc>
    <lastmod>${node.updatedAt}</lastmod>
    <priority>0.6</priority>
  </url>`);
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}
</urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);

    // Return minimal sitemap on error
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }
}
