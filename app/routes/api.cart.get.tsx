import type {LoaderFunctionArgs} from 'react-router';

export async function loader({request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const cartId = url.searchParams.get('cartId');

  if (!cartId) {
    return Response.json({error: 'Cart ID is required'}, {status: 400});
  }

  try {
    // Dynamic import to avoid bundling server code in client
    const {getCart} = await import('~/lib/shopify-cart.server');

    const cart = await getCart(cartId);

    if (!cart) {
      return Response.json({error: 'Cart not found'}, {status: 404});
    }

    return Response.json({cart}, {status: 200});
  } catch (error) {
    console.error('Cart get error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch cart';
    return Response.json({error: message}, {status: 500});
  }
}
