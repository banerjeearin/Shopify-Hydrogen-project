import {getStorefrontApiUrl, getPublicTokenHeaders} from './shopify.server';
import {PRODUCT_QUERY, PRODUCTS_QUERY, COLLECTIONS_QUERY} from './shopify-queries';

interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{message: string}>;
}

export async function fetchProduct(handle: string) {
  const response = await fetch(getStorefrontApiUrl(), {
    method: 'POST',
    headers: getPublicTokenHeaders(),
    body: JSON.stringify({
      query: PRODUCT_QUERY,
      variables: {handle},
    }),
  });

  const json: GraphQLResponse<{product: any}> = await response.json();
  
  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  return json.data.product;
}

export async function fetchProducts(first: number = 20, after?: string) {
  const response = await fetch(getStorefrontApiUrl(), {
    method: 'POST',
    headers: getPublicTokenHeaders(),
    body: JSON.stringify({
      query: PRODUCTS_QUERY,
      variables: {first, after},
    }),
  });

  const json: GraphQLResponse<{products: any}> = await response.json();
  
  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  return json.data.products;
}

export async function fetchCollections(first: number = 10) {
  const response = await fetch(getStorefrontApiUrl(), {
    method: 'POST',
    headers: getPublicTokenHeaders(),
    body: JSON.stringify({
      query: COLLECTIONS_QUERY,
      variables: {first},
    }),
  });

  const json: GraphQLResponse<{collections: any}> = await response.json();
  
  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  return json.data.collections;
}

