import type {ActionFunctionArgs} from 'react-router';
import {json} from 'react-router';
import type {CartInput} from '~/lib/shopify.types';

export async function action({request}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  try {
    // Dynamic import to avoid bundling server code in client
    const {createCart} = await import('~/lib/shopify-cart.server');

    const body: {input?: CartInput} = await request.json();
    const cart = await createCart(body.input || {});

    return json({cart}, {status: 200});
  } catch (error) {
    console.error('Cart create error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create cart';
    return json({error: message}, {status: 500});
  }
}
