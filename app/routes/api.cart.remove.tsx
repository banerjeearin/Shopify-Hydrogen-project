import type {ActionFunctionArgs} from 'react-router';
import {json} from 'react-router';

export async function action({request}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  try {
    // Dynamic import to avoid bundling server code in client
    const {removeFromCart} = await import('~/lib/shopify-cart.server');
    
    const body: {cartId: string; lineIds: string[]} = await request.json();

    if (!body.cartId) {
      return json({error: 'Cart ID is required'}, {status: 400});
    }

    if (!body.lineIds || body.lineIds.length === 0) {
      return json({error: 'At least one line ID is required'}, {status: 400});
    }

    const cart = await removeFromCart(body.cartId, body.lineIds);

    return json({cart}, {status: 200});
  } catch (error) {
    console.error('Cart remove error:', error);
    const message = error instanceof Error ? error.message : 'Failed to remove from cart';
    return json({error: message}, {status: 500});
  }
}
