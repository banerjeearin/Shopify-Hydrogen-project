import {getStorefrontApiUrl, getPublicTokenHeaders, isShopifyConfigured} from './shopify.server';
import {
  CREATE_CART_MUTATION,
  ADD_TO_CART_MUTATION,
  UPDATE_CART_LINES_MUTATION,
  REMOVE_FROM_CART_MUTATION,
  GET_CART_QUERY,
} from './shopify-queries';
import type {
  GraphQLResponse,
  Cart,
  CartInput,
  CartLineInput,
  CartLineUpdateInput,
  CartMutationResponse,
} from './shopify.types';

// Configuration for fetch with timeout
const FETCH_TIMEOUT = 10000; // 10 seconds

/**
 * Fetch with timeout and abort controller
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number = FETCH_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout - please try again');
    }
    throw error;
  }
}

/**
 * Create a new cart
 * @param input - Optional cart input with initial lines
 * @returns New cart object
 */
export async function createCart(input: CartInput = {}): Promise<Cart> {
  if (!isShopifyConfigured()) {
    throw new Error('Shopify not configured');
  }

  try {
    const response = await fetchWithTimeout(
      getStorefrontApiUrl(),
      {
        method: 'POST',
        headers: {
          ...getPublicTokenHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: CREATE_CART_MUTATION,
          variables: {input},
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json: GraphQLResponse<{cartCreate: CartMutationResponse}> = await response.json();

    if (json.errors && json.errors.length > 0) {
      console.error('GraphQL errors:', json.errors);
      throw new Error(json.errors[0].message);
    }

    if (!json.data?.cartCreate?.cart) {
      throw new Error('Failed to create cart');
    }

    if (json.data.cartCreate.userErrors && json.data.cartCreate.userErrors.length > 0) {
      throw new Error(json.data.cartCreate.userErrors[0].message);
    }

    return json.data.cartCreate.cart;
  } catch (error) {
    console.error('Error creating cart:', error);
    throw error;
  }
}

/**
 * Add items to cart
 * @param cartId - Cart ID
 * @param lines - Array of line items to add
 * @returns Updated cart object
 */
export async function addToCart(cartId: string, lines: CartLineInput[]): Promise<Cart> {
  if (!isShopifyConfigured()) {
    throw new Error('Shopify not configured');
  }

  if (!cartId) {
    throw new Error('Cart ID is required');
  }

  if (!lines || lines.length === 0) {
    throw new Error('At least one line item is required');
  }

  try {
    const response = await fetchWithTimeout(
      getStorefrontApiUrl(),
      {
        method: 'POST',
        headers: {
          ...getPublicTokenHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: ADD_TO_CART_MUTATION,
          variables: {cartId, lines},
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json: GraphQLResponse<{cartLinesAdd: CartMutationResponse}> = await response.json();

    if (json.errors && json.errors.length > 0) {
      console.error('GraphQL errors:', json.errors);
      throw new Error(json.errors[0].message);
    }

    if (!json.data?.cartLinesAdd?.cart) {
      throw new Error('Failed to add items to cart');
    }

    if (json.data.cartLinesAdd.userErrors && json.data.cartLinesAdd.userErrors.length > 0) {
      throw new Error(json.data.cartLinesAdd.userErrors[0].message);
    }

    return json.data.cartLinesAdd.cart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

/**
 * Update cart line quantities
 * @param cartId - Cart ID
 * @param lines - Array of line updates
 * @returns Updated cart object
 */
export async function updateCartLines(cartId: string, lines: CartLineUpdateInput[]): Promise<Cart> {
  if (!isShopifyConfigured()) {
    throw new Error('Shopify not configured');
  }

  if (!cartId) {
    throw new Error('Cart ID is required');
  }

  if (!lines || lines.length === 0) {
    throw new Error('At least one line update is required');
  }

  try {
    const response = await fetchWithTimeout(
      getStorefrontApiUrl(),
      {
        method: 'POST',
        headers: {
          ...getPublicTokenHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: UPDATE_CART_LINES_MUTATION,
          variables: {cartId, lines},
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json: GraphQLResponse<{cartLinesUpdate: CartMutationResponse}> = await response.json();

    if (json.errors && json.errors.length > 0) {
      console.error('GraphQL errors:', json.errors);
      throw new Error(json.errors[0].message);
    }

    if (!json.data?.cartLinesUpdate?.cart) {
      throw new Error('Failed to update cart');
    }

    if (json.data.cartLinesUpdate.userErrors && json.data.cartLinesUpdate.userErrors.length > 0) {
      throw new Error(json.data.cartLinesUpdate.userErrors[0].message);
    }

    return json.data.cartLinesUpdate.cart;
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
}

/**
 * Remove items from cart
 * @param cartId - Cart ID
 * @param lineIds - Array of line IDs to remove
 * @returns Updated cart object
 */
export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  if (!isShopifyConfigured()) {
    throw new Error('Shopify not configured');
  }

  if (!cartId) {
    throw new Error('Cart ID is required');
  }

  if (!lineIds || lineIds.length === 0) {
    throw new Error('At least one line ID is required');
  }

  try {
    const response = await fetchWithTimeout(
      getStorefrontApiUrl(),
      {
        method: 'POST',
        headers: {
          ...getPublicTokenHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: REMOVE_FROM_CART_MUTATION,
          variables: {cartId, lineIds},
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json: GraphQLResponse<{cartLinesRemove: CartMutationResponse}> = await response.json();

    if (json.errors && json.errors.length > 0) {
      console.error('GraphQL errors:', json.errors);
      throw new Error(json.errors[0].message);
    }

    if (!json.data?.cartLinesRemove?.cart) {
      throw new Error('Failed to remove items from cart');
    }

    if (json.data.cartLinesRemove.userErrors && json.data.cartLinesRemove.userErrors.length > 0) {
      throw new Error(json.data.cartLinesRemove.userErrors[0].message);
    }

    return json.data.cartLinesRemove.cart;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
}

/**
 * Get cart by ID
 * @param cartId - Cart ID
 * @returns Cart object or null if not found
 */
export async function getCart(cartId: string): Promise<Cart | null> {
  if (!isShopifyConfigured()) {
    console.warn('Shopify not configured, returning null');
    return null;
  }

  if (!cartId) {
    throw new Error('Cart ID is required');
  }

  try {
    const response = await fetchWithTimeout(
      getStorefrontApiUrl(),
      {
        method: 'POST',
        headers: {
          ...getPublicTokenHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: GET_CART_QUERY,
          variables: {cartId},
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json: GraphQLResponse<{cart: Cart | null}> = await response.json();

    if (json.errors && json.errors.length > 0) {
      console.error('GraphQL errors:', json.errors);
      throw new Error(json.errors[0].message);
    }

    return json.data?.cart || null;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
}
