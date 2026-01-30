import type {ActionFunctionArgs} from 'react-router';
import type {CartInput} from '~/lib/shopify.types';
import {createCart} from '~/lib/shopify-cart.server';

export async function action({request}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return Response.json({error: 'Method not allowed'}, {status: 405});
  }

  try {

    const body: {input?: CartInput} = await request.json();
    const cart = await createCart(body.input || {});

    return Response.json({cart}, {status: 200});
  } catch (error) {
    console.error('Cart create error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create cart';
    return Response.json({error: message}, {status: 500});
  }
}
