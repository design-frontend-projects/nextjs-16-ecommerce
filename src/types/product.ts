// Types for the e-commerce application
export interface Product {
  id?: string;
  product_id: string | number;
  supplier_id: string | number | null;
  name: string;
  description: string | null;
  base_price: string;
  cost_price: string;
  sku: string;
  barcode: string | null;
  category_id: string | number | null;
  weight: string | null;
  dimensions: string | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  inventory?: Inventory | null;
}

export interface Category {
  id?: string;
  category_id: string | number;
  name: string;
  description: string | null;
  created_at: string;
  products_count?: number;
}

export interface Inventory {
  inventory_id: number;
  product_id: string | number | null;
  quantity: number | null;
  reorder_level?: number | null;
  max_stock_level?: number | null;
  location?: string | null;
  last_restocked?: string | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  order_id: number;
  customer_id: number;
  order_number: string;
  order_date: string;
  status: OrderStatus;
  subtotal: string;
  discount_amount: string;
  shipping_amount: string;
  tax_amount: string;
  total_amount: string;
  payment_status: PaymentStatus;
  shipping_address_line1: string | null;
  shipping_address_line2: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_postal_code: string | null;
  shipping_country: string | null;
  notes: string | null;
  order_items?: OrderItem[];
  shipments?: Shipment[];
}

export interface OrderItem {
  order_item_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: string;
  subtotal: string;
  product?: Product;
}

export interface Shipment {
  shipment_id: number;
  order_id: number;
  tracking_number: string | null;
  shipped_date: string | null;
  delivered_date: string | null;
  carrier: string | null;
  status: ShipmentStatus;
  notes: string | null;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type ShipmentStatus =
  | 'prepared'
  | 'shipped'
  | 'in_transit'
  | 'delivered'
  | 'returned';

export interface Customer {
  customer_id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  date_of_birth: string | null;
  loyalty_points: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// API Response types
export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CategoriesResponse {
  categories: Category[];
}

// Filter types
export interface ProductFilters {
  category?: string | number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: SortOption;
  page?: number;
  limit?: number;
}

export type SortOption =
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'name_asc'
  | 'name_desc';
