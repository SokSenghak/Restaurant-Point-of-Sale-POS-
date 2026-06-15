export type UserRole = 'Admin' | 'Manager' | 'Cashier' | 'Kitchen' | 'Waiter';
export type TableStatus = 'Available' | 'Occupied' | 'Reserved';
export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';
export type PaymentMethod = 'Cash' | 'Card' | 'ABA Pay' | 'KHQR' | 'Wing' | 'ACLEDA';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  active: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name or emoji string
  sort_order: number;
  active: boolean;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string;
  small_price: number;
  medium_price: number;
  large_price: number;
  image: string;
  popular: boolean;
  discount_percent: number;
  rating: number;
  active: boolean;
  badge?: string;
  created_at: string;
}

export interface Topping {
  id: string;
  name: string;
  price: number;
  image: string;
  active: boolean;
}

export interface ProductTopping {
  product_id: string;
  topping_id: string;
}

export interface Table {
  id: string;
  table_number: string;
  capacity: number;
  status: TableStatus;
  active: boolean;
}

export interface Order {
  id: string;
  order_number: string;
  table_id: string | null;
  customer_id: string | null;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  payment_method: PaymentMethod | null;
  created_by: string; // user id
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  size: 'Small' | 'Medium' | 'Large';
  quantity: number;
  price: number;
  notes?: string;
  // Included directly for helper views
  toppings?: Topping[];
}

export interface OrderItemTopping {
  id: string;
  order_item_id: string;
  topping_id: string;
  price: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  active: boolean;
  expire_date: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  points: number;
  visits: number;
}

export interface NotificationMsg {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: Date;
}
