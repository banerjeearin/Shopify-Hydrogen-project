import type {ActionFunctionArgs} from 'react-router';
import type {CartLineUpdateInput} from '~/lib/shopify.types';
import {updateCartLines} from '~/lib/shopify-cart.server';

export async function action({request}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return Response.json({error: 'Method not allowed'}, {status: 405});
  }

  try {

    const body: {cartId: string; lines: CartLineUpdateInput[]} = await request.json();

    if (!body.cartId) {
      return Response.json({error: 'Cart ID is required'}, {status: 400});
    }

    if (!body.lines || body.lines.length === 0) {
      return Response.json({error: 'At least one line update is required'}, {status: 400});
    }

    const cart = await updateCartLines(body.cartId, body.lines);

    return Response.json({cart}, {status: 200});
  } catch (error) {
    console.error('Cart update error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update cart';
    return Response.json({error: message}, {status: 500});
  }
}
