export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  unit: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ShippingRoute {
  id: string;
  name: string;
  percentage: number;
}

export interface User {
  id?: string; // Optional for compatibility with legacy code, but used in management
  username: string; // Acts as Razão Social
  password?: string; // Stored for mock authentication
  email: string;
  role: 'admin' | 'user';
  regionId?: string; // Link to ShippingRoute
  // Extended fields
  cnpj?: string;
  address?: string;
  city?: string;
  cep?: string;
  state?: string;
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: string;
  userId: string;
  userName: string; // Snapshot of username at time of order
  userEmail: string;
  date: string; // ISO String
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  shippingRouteName?: string;
}

export enum AppView {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  RESET_PASSWORD = 'RESET_PASSWORD',
  PRODUCT_LIST = 'PRODUCT_LIST',
  SUMMARY = 'SUMMARY',
  CONFIRMATION = 'CONFIRMATION',
  PRODUCT_MANAGEMENT = 'PRODUCT_MANAGEMENT',
  USER_MANAGEMENT = 'USER_MANAGEMENT',
  SHIPPING_MANAGEMENT = 'SHIPPING_MANAGEMENT',
  COCKPIT = 'COCKPIT'
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  total: number;
  items: CartItem[];
}