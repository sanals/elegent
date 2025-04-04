/**
 * Common Types for Elegent Electronics Store
 * 
 * This file contains type definitions that are shared between
 * the customer frontend and admin dashboard applications.
 */

// User related types
export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'CUSTOMER' | 'ADMIN';
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

// Product related types
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    imageUrl: string;
    categoryId: number;
    featured: boolean;
    discount: number;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    id: number;
    name: string;
    description: string;
    imageUrl?: string;
    parentCategoryId?: number;
    createdAt: string;
    updatedAt: string;
}

// Order related types
export interface OrderItem {
    id: number;
    productId: number;
    quantity: number;
    price: number;
    productName: string;
}

export interface Order {
    id: number;
    userId: number;
    status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    totalAmount: number;
    shippingAddress: string;
    paymentMethod: string;
    orderItems: OrderItem[];
    createdAt: string;
    updatedAt: string;
}

// API response types
export interface ApiResponse<T> {
    status: string;
    message: string;
    data: T;
}

export interface PaginatedResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
} 