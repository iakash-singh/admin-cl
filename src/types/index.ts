// Core type definitions for the admin interface
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  registrationDate: string;
  lastActive: string;
  status: 'active' | 'inactive' | 'suspended';
  userType: 'customer' | 'vendor' | 'admin';
  totalRentals: number;
  totalSpent: number;
  location: string;
}

export interface Vendor {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  onboardingStatus: 'incomplete' | 'pending_review' | 'completed';
  totalProducts: number;
  totalOrders: number;
  rating: number;
  revenue: number;
  commission: number;
  businessType: string;
  documentsSubmitted: boolean;
}

export interface Product {
  id: string;
  name: string;
  vendorId: string;
  vendorName: string;
  category: string;
  price: number;
  description: string;
  images: string[];
  totalRentals: number;
  rating: number;
  reviewCount: number;
  availability: 'available' | 'rented' | 'maintenance';
  wishlistCount: number;
  lastRented: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  vendorId: string;
  vendorName: string;
  productId: string;
  productName: string;
  status: 'active' | 'pending' | 'completed' | 'cancelled' | 'disputed';
  startDate: string;
  endDate: string;
  totalAmount: number;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  createdAt: string;
  location: string;
}

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  vendorId: string;
  vendorName: string;
  productId: string;
  productName: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'flagged';
  helpful: number;
}

export interface Analytics {
  users: {
    totalUsers: number;
    newUsersToday: number;
    newUsersThisWeek: number;
    userGrowthRate: number;
    conversionRate: number;
    cartAbandonmentRate: number;
    retentionRate: number;
  };
  vendors: {
    totalVendors: number;
    pendingApproval: number;
    onboardingDropoff: number;
    averageRevenue: number;
    inventoryEfficiency: number;
  };
  orders: {
    totalOrders: number;
    activeOrders: number;
    pendingOrders: number;
    completedOrders: number;
    disputedOrders: number;
    revenueToday: number;
    revenueThisMonth: number;
  };
  products: {
    totalProducts: number;
    mostRentedProducts: Product[];
    leastPerformingProducts: Product[];
    highWishlistProducts: Product[];
  };
}

export interface Location {
  city: string;
  userCount: number;
  vendorCount: number;
  orderCount: number;
  revenue: number;
}