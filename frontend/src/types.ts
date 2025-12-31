export interface Product {
    _id: string;
    name: string;
    price: number;
    category: string;
    image?: string;
    description?: string;
}

export interface OrderItem {
    name: string;
    qty: number;
    image: string;
    price: number;
    product: string | Product;
}

export interface Order {
    _id: string;
    user?: string;
    orderItems: OrderItem[];
    totalPrice: number;
    isPaid: boolean;
    isDelivered: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserData {
    _id: string;
    name: string;
    email: string;
    role: string;
}
