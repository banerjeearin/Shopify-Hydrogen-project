import type {LoaderFunctionArgs} from 'react-router';

export async function loader({request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const robotsTxt = `User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /admin
Disallow: /cart
Disallow: /checkout
Disallow: /account
Disallow: /api/

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
