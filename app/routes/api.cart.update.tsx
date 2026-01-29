import type {ActionFunctionArgs} from 'react-router';
import {json} from 'react-router';
import type {CartLineUpdateInput} from '~/lib/shopify.types';

export async function action({request}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  try {
    // Dynamic import to avoid bundling server code in client
    const {updateCartLines} = await import('~/lib/shopify-cart.server');

    const body: {cartId: string; lines: CartLineUpdateInput[]} = await request.json();

    if (!body.cartId) {
      return json({error: 'Cart ID is required'}, {status: 400});
    }

    if (!body.lines || body.lines.length === 0) {
      return json({error: 'At least one line update is required'}, {status: 400});
    }

    const cart = await updateCartLines(body.cartId, body.lines);

    return json({cart}, {status: 200});
  } catch (error) {
    console.error('Cart update error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update cart';
    return json({error: message}, {status: 500});
  }
}
