export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  avatar?: { public_id?: string; url: string };
  addresses?: Array<{
    label?: string;
    houseNo?: string;
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
    isDefault?: boolean;
  }>;
}

export interface Restaurant {
  _id: string;
  name: string;
  description: string;
  location: string;
  rating: number;
  cuisine: string;
  images: Array<{ url: string }>;
}

export interface Menu {
  _id: string;
  name: string;
  category: string;
  restaurant: string;
}

export interface FoodItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  images: Array<{ url: string }>;
  menu?: Menu;
  restaurant?: Restaurant;
}

export interface CartItemType {
  foodItem: FoodItem;
  quantity: number;
}

export interface Cart {
  _id: string;
  restaurant: string;
  items: CartItemType[];
}

export interface Order {
  _id: string;
  createdAt: string;
  totalPrice: number;
  orderStatus: string;
  paymentInfo?: { status?: string };
  deliveryInfo?: {
    address?: string;
    city?: string;
    phoneNo?: string;
  };
}
