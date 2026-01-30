import type {ActionFunctionArgs} from 'react-router';
import {removeFromCart} from '~/lib/shopify-cart.server';

export async function action({request}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return Response.json({error: 'Method not allowed'}, {status: 405});
  }

  try {

    const body: {cartId: string; lineIds: string[]} = await request.json();

    if (!body.cartId) {
      return Response.json({error: 'Cart ID is required'}, {status: 400});
    }

    if (!body.lineIds || body.lineIds.length === 0) {
      return Response.json({error: 'At least one line ID is required'}, {status: 400});
    }

    const cart = await removeFromCart(body.cartId, body.lineIds);

    return Response.json({cart}, {status: 200});
  } catch (error) {
    console.error('Cart remove error:', error);
    const message = error instanceof Error ? error.message : 'Failed to remove from cart';
    return Response.json({error: message}, {status: 500});
  }
}
