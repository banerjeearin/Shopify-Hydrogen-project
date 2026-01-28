import {getStorefrontApiUrl, getPublicTokenHeaders, isShopifyConfigured} from './shopify.server';
import {
  PRODUCT_QUERY,
  PRODUCTS_QUERY,
  COLLECTIONS_QUERY,
  CREATE_CART_MUTATION,
  ADD_TO_CART_MUTATION,
  UPDATE_CART_LINES_MUTATION,
  REMOVE_FROM_CART_MUTATION,
  GET_CART_QUERY,
} from './shopify-queries';
import type {
  GraphQLResponse,
  Product,
  ProductConnection,
  CollectionConnection,
  Cart,
  CartInput,
  CartLineInput,
  CartLineUpdateInput,
  CartMutationResponse,
} from './shopify.types';

// Configuration for fetch with timeout
const FETCH_TIMEOUT = 10000; // 10 seconds

/**
 * Validate input parameters to prevent injection attacks
 */
function validateHandle(handle: string): void {
  if (!handle || typeof handle !== 'string') {
    throw new Error('Invalid product handle');
  }
  // Shopify handles are lowercase alphanumeric with hyphens
  if (!/^[a-z0-9-]+$/.test(handle)) {
    throw new Error('Invalid product handle format');
  }
}

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
 * Fetch product by handle
 * @param handle - Product handle (URL-safe identifier)
 * @returns Product data or null if not found
 */
export async function fetchProduct(handle: string): Promise<Product | null> {
  if (!isShopifyConfigured()) {
    console.warn('Shopify not configured, returning null');
    return null;
  }

  validateHandle(handle);

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
          query: PRODUCT_QUERY,
          variables: {handle},
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json: GraphQLResponse<{product: Product | null}> = await response.json();

    if (json.errors && json.errors.length > 0) {
      console.error('GraphQL errors:', json.errors);
      throw new Error(json.errors[0].message);
    }

    return json.data.product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

/**
 * Fetch products with pagination
 * @param first - Number of products to fetch (max 250)
 * @param after - Cursor for pagination
 * @returns ProductConnection with products and pagination info
 */
export async function fetchProducts(
  first: number = 20,
  after?: string
): Promise<ProductConnection> {
  if (!isShopifyConfigured()) {
    console.warn('Shopify not configured, returning empty products');
    return {edges: [], pageInfo: {hasNextPage: false}};
  }

  // Validate pagination parameters
  if (first < 1 || first > 250) {
    throw new Error('First parameter must be between 1 and 250');
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
          query: PRODUCTS_QUERY,
          variables: {first, after},
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json: GraphQLResponse<{products: ProductConnection}> = await response.json();

    if (json.errors && json.errors.length > 0) {
      console.error('GraphQL errors:', json.errors);
      throw new Error(json.errors[0].message);
    }

    return json.data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

/**
 * Fetch collections
 * @param first - Number of collections to fetch
 * @returns CollectionConnection with collections
 */
export async function fetchCollections(first: number = 10): Promise<CollectionConnection> {
  if (!isShopifyConfigured()) {
    console.warn('Shopify not configured, returning empty collections');
    return {edges: [], pageInfo: {hasNextPage: false}};
  }

  if (first < 1 || first > 250) {
    throw new Error('First parameter must be between 1 and 250');
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
          query: COLLECTIONS_QUERY,
          variables: {first},
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json: GraphQLResponse<{collections: CollectionConnection}> = await response.json();

    if (json.errors && json.errors.length > 0) {
      console.error('GraphQL errors:', json.errors);
      throw new Error(json.errors[0].message);
    }

    return json.data.collections;
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }
}

// ============================================================================
// Cart API Functions
// ============================================================================

/**
 * Create a new cart
 * @param input - Cart input with optional initial lines
 * @returns Newly created cart
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

    const {cart, userErrors} = json.data.cartCreate;

    if (userErrors && userErrors.length > 0) {
      throw new Error(userErrors[0].message);
    }

    if (!cart) {
      throw new Error('Failed to create cart');
    }

    return cart;
  } catch (error) {
    console.error('Error creating cart:', error);
    throw error;
  }
}

/**
 * Add items to cart
 * @param cartId - Cart ID
 * @param lines - Array of cart line inputs
 * @returns Updated cart
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

    const {cart, userErrors} = json.data.cartLinesAdd;

    if (userErrors && userErrors.length > 0) {
      throw new Error(userErrors[0].message);
    }

    if (!cart) {
      throw new Error('Failed to add items to cart');
    }

    return cart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

/**
 * Update cart line quantities
 * @param cartId - Cart ID
 * @param lines - Array of line updates with id and quantity
 * @returns Updated cart
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

    const {cart, userErrors} = json.data.cartLinesUpdate;

    if (userErrors && userErrors.length > 0) {
      throw new Error(userErrors[0].message);
    }

    if (!cart) {
      throw new Error('Failed to update cart');
    }

    return cart;
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
}

/**
 * Remove lines from cart
 * @param cartId - Cart ID
 * @param lineIds - Array of line IDs to remove
 * @returns Updated cart
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

    const {cart, userErrors} = json.data.cartLinesRemove;

    if (userErrors && userErrors.length > 0) {
      throw new Error(userErrors[0].message);
    }

    if (!cart) {
      throw new Error('Failed to remove items from cart');
    }

    return cart;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
}

/**
 * Get cart by ID
 * @param cartId - Cart ID
 * @returns Cart or null if not found
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

    return json.data.cart;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
}

