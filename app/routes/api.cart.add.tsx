import type {ActionFunctionArgs} from 'react-router';
import {json} from 'react-router';
import {addToCart} from '~/lib/shopify-cart.server';
import type {CartLineInput} from '~/lib/shopify.types';

export async function action({request}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  try {
    const body: {cartId: string; lines: CartLineInput[]} = await request.json();

    if (!body.cartId) {
      return json({error: 'Cart ID is required'}, {status: 400});
    }

    if (!body.lines || body.lines.length === 0) {
      return json({error: 'At least one line item is required'}, {status: 400});
    }

    const cart = await addToCart(body.cartId, body.lines);

    return json({cart}, {status: 200});
  } catch (error) {
    console.error('Cart add error:', error);
    const message = error instanceof Error ? error.message : 'Failed to add to cart';
    return json({error: message}, {status: 500});
  }
}
