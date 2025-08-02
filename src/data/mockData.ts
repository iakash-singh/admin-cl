import { User, Vendor, Product, Order, Feedback, Analytics, Location } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    registrationDate: '2024-01-15',
    lastActive: '2024-01-20',
    status: 'active',
    userType: 'customer',
    totalRentals: 12,
    totalSpent: 2400,
    location: 'New York, NY'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    registrationDate: '2024-01-18',
    lastActive: '2024-01-20',
    status: 'active',
    userType: 'customer',
    totalRentals: 8,
    totalSpent: 1600,
    location: 'Los Angeles, CA'
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike.wilson@example.com',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    registrationDate: '2024-01-19',
    lastActive: '2024-01-19',
    status: 'inactive',
    userType: 'customer',
    totalRentals: 3,
    totalSpent: 450,
    location: 'Chicago, IL'
  }
];

export const mockVendors: Vendor[] = [
  {
    id: '1',
    businessName: 'Tech Rentals Pro',
    ownerName: 'David Brown',
    email: 'david@techrentalspro.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street, San Francisco, CA',
    registrationDate: '2024-01-10',
    verificationStatus: 'verified',
    onboardingStatus: 'completed',
    totalProducts: 45,
    totalOrders: 128,
    rating: 4.8,
    revenue: 15600,
    commission: 2340,
    businessType: 'Electronics',
    documentsSubmitted: true
  },
  {
    id: '2',
    businessName: 'Party Equipment Central',
    ownerName: 'Lisa Martinez',
    email: 'lisa@partyequipment.com',
    phone: '+1 (555) 987-6543',
    address: '456 Party Lane, Miami, FL',
    registrationDate: '2024-01-12',
    verificationStatus: 'pending',
    onboardingStatus: 'pending_review',
    totalProducts: 67,
    totalOrders: 89,
    rating: 4.6,
    revenue: 12300,
    commission: 1845,
    businessType: 'Event Equipment',
    documentsSubmitted: true
  },
  {
    id: '3',
    businessName: 'Tool Master Rentals',
    ownerName: 'Robert Taylor',
    email: 'robert@toolmaster.com',
    phone: '+1 (555) 456-7890',
    address: '789 Tool Avenue, Denver, CO',
    registrationDate: '2024-01-14',
    verificationStatus: 'verified',
    onboardingStatus: 'completed',
    totalProducts: 234,
    totalOrders: 567,
    rating: 4.9,
    revenue: 34500,
    commission: 5175,
    businessType: 'Tools & Equipment',
    documentsSubmitted: true
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Professional Camera Kit',
    vendorId: '1',
    vendorName: 'Tech Rentals Pro',
    category: 'Photography',
    price: 150,
    description: 'High-end DSLR camera with multiple lenses',
    images: ['https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg'],
    totalRentals: 45,
    rating: 4.8,
    reviewCount: 23,
    availability: 'available',
    wishlistCount: 12,
    lastRented: '2024-01-18'
  },
  {
    id: '2',
    name: 'DJ Sound System',
    vendorId: '2',
    vendorName: 'Party Equipment Central',
    category: 'Audio',
    price: 200,
    description: 'Complete DJ setup with speakers and mixer',
    images: ['https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg'],
    totalRentals: 32,
    rating: 4.6,
    reviewCount: 18,
    availability: 'rented',
    wishlistCount: 28,
    lastRented: '2024-01-19'
  },
  {
    id: '3',
    name: 'Power Drill Set',
    vendorId: '3',
    vendorName: 'Tool Master Rentals',
    category: 'Tools',
    price: 45,
    description: 'Professional cordless drill with bits',
    images: ['https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg'],
    totalRentals: 78,
    rating: 4.9,
    reviewCount: 41,
    availability: 'available',
    wishlistCount: 15,
    lastRented: '2024-01-17'
  }
];

export const mockOrders: Order[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Smith',
    vendorId: '1',
    vendorName: 'Tech Rentals Pro',
    productId: '1',
    productName: 'Professional Camera Kit',
    status: 'active',
    startDate: '2024-01-20',
    endDate: '2024-01-25',
    totalAmount: 750,
    paymentStatus: 'paid',
    createdAt: '2024-01-19',
    location: 'New York, NY'
  },
  {
    id: '2',
    userId: '2',
    userName: 'Sarah Johnson',
    vendorId: '2',
    vendorName: 'Party Equipment Central',
    productId: '2',
    productName: 'DJ Sound System',
    status: 'pending',
    startDate: '2024-01-22',
    endDate: '2024-01-24',
    totalAmount: 400,
    paymentStatus: 'paid',
    createdAt: '2024-01-20',
    location: 'Los Angeles, CA'
  },
  {
    id: '3',
    userId: '3',
    userName: 'Mike Wilson',
    vendorId: '3',
    vendorName: 'Tool Master Rentals',
    productId: '3',
    productName: 'Power Drill Set',
    status: 'completed',
    startDate: '2024-01-15',
    endDate: '2024-01-17',
    totalAmount: 90,
    paymentStatus: 'paid',
    createdAt: '2024-01-14',
    location: 'Chicago, IL'
  }
];

export const mockFeedback: Feedback[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Smith',
    vendorId: '1',
    vendorName: 'Tech Rentals Pro',
    productId: '1',
    productName: 'Professional Camera Kit',
    rating: 5,
    comment: 'Excellent camera quality and very professional service!',
    createdAt: '2024-01-18',
    status: 'approved',
    helpful: 8
  },
  {
    id: '2',
    userId: '2',
    userName: 'Sarah Johnson',
    vendorId: '2',
    vendorName: 'Party Equipment Central',
    productId: '2',
    productName: 'DJ Sound System',
    rating: 4,
    comment: 'Great sound quality, delivery was a bit late though.',
    createdAt: '2024-01-19',
    status: 'approved',
    helpful: 5
  },
  {
    id: '3',
    userId: '3',
    userName: 'Mike Wilson',
    vendorId: '3',
    vendorName: 'Tool Master Rentals',
    productId: '3',
    productName: 'Power Drill Set',
    rating: 5,
    comment: 'Perfect tool for my project. Highly recommend!',
    createdAt: '2024-01-17',
    status: 'approved',
    helpful: 12
  }
];

export const mockAnalytics: Analytics = {
  users: {
    totalUsers: 1247,
    newUsersToday: 23,
    newUsersThisWeek: 156,
    userGrowthRate: 12.5,
    conversionRate: 68.3,
    cartAbandonmentRate: 31.7,
    retentionRate: 76.8
  },
  vendors: {
    totalVendors: 89,
    pendingApproval: 12,
    onboardingDropoff: 23.4,
    averageRevenue: 18400,
    inventoryEfficiency: 82.1
  },
  orders: {
    totalOrders: 3456,
    activeOrders: 234,
    pendingOrders: 67,
    completedOrders: 3089,
    disputedOrders: 14,
    revenueToday: 12350,
    revenueThisMonth: 234500
  },
  products: {
    totalProducts: 2134,
    mostRentedProducts: mockProducts.slice(0, 3),
    leastPerformingProducts: mockProducts.slice().reverse().slice(0, 3),
    highWishlistProducts: mockProducts.slice(0, 3)
  }
};

export const mockLocations: Location[] = [
  {
    city: 'New York, NY',
    userCount: 234,
    vendorCount: 18,
    orderCount: 567,
    revenue: 67800
  },
  {
    city: 'Los Angeles, CA',
    userCount: 189,
    vendorCount: 15,
    orderCount: 423,
    revenue: 54200
  },
  {
    city: 'Chicago, IL',
    userCount: 156,
    vendorCount: 12,
    orderCount: 345,
    revenue: 42300
  },
  {
    city: 'San Francisco, CA',
    userCount: 123,
    vendorCount: 14,
    orderCount: 287,
    revenue: 38900
  },
  {
    city: 'Miami, FL',
    userCount: 98,
    vendorCount: 9,
    orderCount: 198,
    revenue: 28700
  }
];