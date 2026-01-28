// TypeScript types for Shopify Storefront API responses

export interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface Image {
  id: string;
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
}

export interface ImageEdge {
  node: Image;
}

export interface ImageConnection {
  edges: ImageEdge[];
}

export interface PriceRange {
  minVariantPrice: MoneyV2;
  maxVariantPrice?: MoneyV2;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: MoneyV2;
  availableForSale: boolean;
  selectedOptions?: Array<{
    name: string;
    value: string;
  }>;
}

export interface ProductVariantEdge {
  node: ProductVariant;
}

export interface ProductVariantConnection {
  edges: ProductVariantEdge[];
}

export interface Metafield {
  id: string;
  namespace: string;
  key: string;
  value: string;
  type: string;
}

export interface MetafieldEdge {
  node: Metafield;
}

export interface MetafieldConnection {
  edges: MetafieldEdge[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: PriceRange;
  images: ImageConnection;
  variants: ProductVariantConnection;
  metafields?: MetafieldConnection;
  availableForSale?: boolean;
  tags?: string[];
}

export interface ProductEdge {
  node: Product;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage?: boolean;
  startCursor?: string;
  endCursor?: string;
}

export interface ProductConnection {
  edges: ProductEdge[];
  pageInfo: PageInfo;
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image?: Image;
}

export interface CollectionEdge {
  node: Collection;
}

export interface CollectionConnection {
  edges: CollectionEdge[];
  pageInfo?: PageInfo;
}

// Cart types - Shopify Storefront API Cart
export interface CartLineMerchandise {
  id: string;
  title: string;
  priceV2: MoneyV2;
  product: {
    id: string;
    title: string;
    handle: string;
    featuredImage?: {
      url: string;
      altText: string | null;
    };
  };
}

export interface CartLine {
  id: string;
  quantity: number;
  cost: {
    totalAmount: MoneyV2;
  };
  merchandise: CartLineMerchandise;
}

export interface CartLineEdge {
  node: CartLine;
}

export interface CartLineConnection {
  edges: CartLineEdge[];
}

export interface CartCost {
  totalAmount: MoneyV2;
  subtotalAmount: MoneyV2;
  totalTaxAmount?: MoneyV2;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: CartCost;
  lines: CartLineConnection;
}

// Input types for cart mutations
export interface CartLineInput {
  merchandiseId: string;
  quantity: number;
}

export interface CartInput {
  lines?: CartLineInput[];
}

export interface CartLineUpdateInput {
  id: string;
  quantity: number;
}

// Mutation response types
export interface UserError {
  field?: string[];
  message: string;
}

export interface CartMutationResponse {
  cart: Cart | null;
  userErrors: UserError[];
}

// GraphQL Response wrapper
export interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations?: Array<{line: number; column: number}>;
    path?: string[];
  }>;
}

// Simplified product type for UI components
export interface SimpleProduct {
  id: string;
  handle: string;
  title: string;
  price: string;
  image?: string;
  imageAlt?: string;
}

// Product with full details for product page
export interface ProductDetails extends Product {
  model3dUrl?: string;
  descriptionHtml?: string;
}
