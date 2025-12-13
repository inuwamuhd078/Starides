// Mock data for restaurants
export const mockRestaurants = [
    {
        id: '1',
        name: 'Pizza Paradise',
        description: 'Authentic Italian pizzas made with fresh ingredients',
        logo: '🍕',
        coverImage: '',
        cuisine: ['Italian', 'Pizza'],
        rating: 4.8,
        totalReviews: 245,
        isOpen: true,
        deliveryFee: 2.99,
        minimumOrder: 15,
        estimatedDeliveryTime: 30,
        address: {
            city: 'New York',
            state: 'NY',
        },
    },
    {
        id: '2',
        name: 'Burger Haven',
        description: 'Juicy burgers and crispy fries',
        logo: '🍔',
        coverImage: '',
        cuisine: ['American', 'Burgers'],
        rating: 4.6,
        totalReviews: 189,
        isOpen: true,
        deliveryFee: 1.99,
        minimumOrder: 10,
        estimatedDeliveryTime: 25,
        address: {
            city: 'New York',
            state: 'NY',
        },
    },
    {
        id: '3',
        name: 'Sushi Master',
        description: 'Fresh sushi and Japanese cuisine',
        logo: '🍱',
        coverImage: '',
        cuisine: ['Japanese', 'Sushi'],
        rating: 4.9,
        totalReviews: 312,
        isOpen: true,
        deliveryFee: 3.99,
        minimumOrder: 20,
        estimatedDeliveryTime: 35,
        address: {
            city: 'New York',
            state: 'NY',
        },
    },
    {
        id: '4',
        name: 'Taco Fiesta',
        description: 'Authentic Mexican tacos and burritos',
        logo: '🌮',
        coverImage: '',
        cuisine: ['Mexican', 'Tacos'],
        rating: 4.7,
        totalReviews: 201,
        isOpen: true,
        deliveryFee: 2.49,
        minimumOrder: 12,
        estimatedDeliveryTime: 28,
        address: {
            city: 'New York',
            state: 'NY',
        },
    },
    {
        id: '5',
        name: 'Thai Delight',
        description: 'Spicy and flavorful Thai dishes',
        logo: '🍜',
        coverImage: '',
        cuisine: ['Thai', 'Asian'],
        rating: 4.5,
        totalReviews: 156,
        isOpen: true,
        deliveryFee: 2.99,
        minimumOrder: 15,
        estimatedDeliveryTime: 32,
        address: {
            city: 'New York',
            state: 'NY',
        },
    },
    {
        id: '6',
        name: 'Pasta Palace',
        description: 'Homemade pasta and Italian classics',
        logo: '🍝',
        coverImage: '',
        cuisine: ['Italian', 'Pasta'],
        rating: 4.8,
        totalReviews: 278,
        isOpen: true,
        deliveryFee: 3.49,
        minimumOrder: 18,
        estimatedDeliveryTime: 33,
        address: {
            city: 'New York',
            state: 'NY',
        },
    },
];

// Mock menu items
export const mockMenuItems: Record<string, any[]> = {
    '1': [
        {
            id: 'm1',
            name: 'Margherita Pizza',
            description: 'Classic tomato sauce, mozzarella, and fresh basil',
            category: 'MAIN_COURSE',
            price: 12.99,
            image: '🍕',
            isAvailable: true,
            isVegetarian: true,
            spicyLevel: 0,
            preparationTime: 20,
        },
        {
            id: 'm2',
            name: 'Pepperoni Pizza',
            description: 'Loaded with pepperoni and extra cheese',
            category: 'MAIN_COURSE',
            price: 14.99,
            image: '🍕',
            isAvailable: true,
            isVegetarian: false,
            spicyLevel: 1,
            preparationTime: 20,
        },
    ],
    '2': [
        {
            id: 'm3',
            name: 'Classic Burger',
            description: 'Beef patty, lettuce, tomato, onion, and special sauce',
            category: 'MAIN_COURSE',
            price: 9.99,
            image: '🍔',
            isAvailable: true,
            isVegetarian: false,
            spicyLevel: 0,
            preparationTime: 15,
        },
        {
            id: 'm4',
            name: 'Cheese Fries',
            description: 'Crispy fries topped with melted cheese',
            category: 'SIDE_DISH',
            price: 5.99,
            image: '🍟',
            isAvailable: true,
            isVegetarian: true,
            spicyLevel: 0,
            preparationTime: 10,
        },
    ],
};

// Mock user
export const mockUser = {
    id: 'user1',
    email: 'demo@starides.com',
    firstName: 'Demo',
    lastName: 'User',
    role: 'CUSTOMER',
    avatar: '',
};

// Mock orders
export const mockOrders = [
    {
        id: 'order1',
        orderNumber: 'ORD-2025-001',
        status: 'DELIVERED',
        total: 27.98,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        estimatedDeliveryTime: new Date(Date.now() - 84600000).toISOString(),
        restaurant: {
            id: '1',
            name: 'Pizza Paradise',
            logo: '🍕',
        },
        items: [
            {
                name: 'Margherita Pizza',
                quantity: 2,
                price: 12.99,
            },
        ],
    },
    {
        id: 'order2',
        orderNumber: 'ORD-2025-002',
        status: 'OUT_FOR_DELIVERY',
        total: 15.98,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        estimatedDeliveryTime: new Date(Date.now() + 600000).toISOString(),
        restaurant: {
            id: '2',
            name: 'Burger Haven',
            logo: '🍔',
        },
        restaurantLocation: {
            latitude: 40.7128,
            longitude: -74.0060
        },
        customerLocation: {
            latitude: 40.7200,
            longitude: -74.0100
        },
        riderLocation: {
            latitude: 40.7150,
            longitude: -74.0080
        },
        items: [
            {
                name: 'Classic Burger',
                quantity: 1,
                price: 9.99,
            },
            {
                name: 'Cheese Fries',
                quantity: 1,
                price: 5.99,
            },
        ],
    },
];
