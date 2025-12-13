export const typeDefs = `#graphql
  # Enums
  enum UserRole {
    CUSTOMER
    VENDOR
    RIDER
    ADMIN
  }

  enum RestaurantStatus {
    PENDING
    APPROVED
    REJECTED
    SUSPENDED
  }

  enum MenuItemCategory {
    APPETIZER
    MAIN_COURSE
    DESSERT
    BEVERAGE
    SIDE_DISH
  }

  enum OrderStatus {
    PENDING
    CONFIRMED
    PREPARING
    READY_FOR_PICKUP
    OUT_FOR_DELIVERY
    DELIVERED
    CANCELLED
  }

  enum PaymentMethod {
    CASH
    CARD
    WALLET
  }

  enum PaymentStatus {
    PENDING
    PAID
    FAILED
    REFUNDED
  }

  # Types
  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    phone: String!
    role: UserRole!
    avatar: String
    isActive: Boolean!
    isVerified: Boolean!
    restaurantId: ID
    restaurant: Restaurant
    vehicleType: String
    vehicleNumber: String
    isAvailable: Boolean
    addresses: [Address!]
    createdAt: String!
    updatedAt: String!
  }

  type Address {
    id: ID!
    label: String!
    street: String!
    city: String!
    state: String!
    zipCode: String!
    coordinates: Coordinates
    isDefault: Boolean!
  }

  type Coordinates {
    latitude: Float!
    longitude: Float!
  }

  type Restaurant {
    id: ID!
    name: String!
    description: String!
    ownerId: ID!
    owner: User!
    logo: String
    coverImage: String
    cuisine: [String!]!
    address: RestaurantAddress!
    phone: String!
    email: String!
    status: RestaurantStatus!
    rating: Float!
    totalReviews: Int!
    isOpen: Boolean!
    openingHours: [OpeningHour!]!
    deliveryFee: Float!
    minimumOrder: Float!
    estimatedDeliveryTime: Int!
    menuItems: [MenuItem!]
    createdAt: String!
    updatedAt: String!
  }

  type RestaurantAddress {
    street: String!
    city: String!
    state: String!
    zipCode: String!
    coordinates: Coordinates!
  }

  type OpeningHour {
    day: String!
    open: String!
    close: String!
  }

  type MenuItem {
    id: ID!
    restaurantId: ID!
    restaurant: Restaurant!
    name: String!
    description: String!
    category: MenuItemCategory!
    price: Float!
    image: String
    isAvailable: Boolean!
    isVegetarian: Boolean!
    isVegan: Boolean!
    isGlutenFree: Boolean!
    spicyLevel: Int!
    preparationTime: Int!
    calories: Int
    ingredients: [String!]!
    allergens: [String!]!
    createdAt: String!
    updatedAt: String!
  }

  type Order {
    id: ID!
    orderNumber: String!
    customerId: ID!
    customer: User!
    restaurantId: ID!
    restaurant: Restaurant!
    riderId: ID
    rider: User
    items: [OrderItem!]!
    subtotal: Float!
    deliveryFee: Float!
    tax: Float!
    total: Float!
    status: OrderStatus!
    paymentMethod: PaymentMethod!
    paymentStatus: PaymentStatus!
    deliveryAddress: RestaurantAddress!
    specialInstructions: String
    estimatedDeliveryTime: String
    actualDeliveryTime: String
    createdAt: String!
    updatedAt: String!
  }

  type OrderItem {
    menuItemId: ID!
    menuItem: MenuItem
    name: String!
    price: Float!
    quantity: Int!
    specialInstructions: String
  }

  type Review {
    id: ID!
    orderId: ID!
    order: Order!
    customerId: ID!
    customer: User!
    restaurantId: ID!
    restaurant: Restaurant!
    riderId: ID
    rider: User
    restaurantRating: Int!
    riderRating: Int
    foodQuality: Int!
    deliverySpeed: Int!
    comment: String
    response: ReviewResponse
    createdAt: String!
    updatedAt: String!
  }

  type ReviewResponse {
    text: String!
    respondedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Stats {
    totalOrders: Int!
    totalRevenue: Float!
    averageOrderValue: Float!
    totalCustomers: Int!
  }

  type ChatMessage {
    id: ID!
    sender: String!
    text: String!
    timestamp: String!
    isBot: Boolean!
  }

  # Inputs
  input RegisterInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    phone: String!
    role: UserRole!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input RequestPasswordResetInput {
    email: String!
  }

  input ResetPasswordInput {
    token: String!
    newPassword: String!
  }

  input AddressInput {
    label: String!
    street: String!
    city: String!
    state: String!
    zipCode: String!
    latitude: Float!
    longitude: Float!
    isDefault: Boolean
  }

  input RestaurantInput {
    name: String!
    description: String!
    cuisine: [String!]!
    street: String!
    city: String!
    state: String!
    zipCode: String!
    latitude: Float!
    longitude: Float!
    phone: String!
    email: String!
    deliveryFee: Float!
    minimumOrder: Float!
    estimatedDeliveryTime: Int!
  }

  input MenuItemInput {
    name: String!
    description: String!
    category: MenuItemCategory!
    price: Float!
    isVegetarian: Boolean
    isVegan: Boolean
    isGlutenFree: Boolean
    spicyLevel: Int
    preparationTime: Int!
    calories: Int
    ingredients: [String!]
    allergens: [String!]
  }

  input OrderItemInput {
    menuItemId: ID!
    quantity: Int!
    specialInstructions: String
  }

  input CreateOrderInput {
    restaurantId: ID!
    items: [OrderItemInput!]!
    paymentMethod: PaymentMethod!
    addressId: String!
    specialInstructions: String
  }

  input ReviewInput {
    orderId: ID!
    restaurantRating: Int!
    riderRating: Int
    foodQuality: Int!
    deliverySpeed: Int!
    comment: String
  }

  # Queries
  type Query {
    # Auth
    me: User

    # Users
    users(role: UserRole): [User!]!
    user(id: ID!): User

    # Restaurants
    restaurants(status: RestaurantStatus, ownerId: ID): [Restaurant!]!
    restaurant(id: ID!): Restaurant
    nearbyRestaurants(latitude: Float!, longitude: Float!, radius: Float): [Restaurant!]!

    # Menu Items
    menuItems(restaurantId: ID!): [MenuItem!]!
    menuItem(id: ID!): MenuItem

    # Orders
    orders(status: OrderStatus): [Order!]!
    order(id: ID!): Order
    myOrders: [Order!]!
    restaurantOrders(restaurantId: ID!, status: OrderStatus): [Order!]!
    availableDeliveries: [Order!]!
    myDeliveries: [Order!]!

    # Reviews
    reviews(restaurantId: ID!): [Review!]!
    review(id: ID!): Review

    # Stats
    adminStats: Stats!
    restaurantStats(restaurantId: ID!): Stats!
  }

  # Mutations
  type Mutation {
    # Auth
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    requestPasswordReset(input: RequestPasswordResetInput!): Boolean!
    resetPassword(input: ResetPasswordInput!): Boolean!

    # User
    updateProfile(firstName: String, lastName: String, phone: String, avatar: String): User!
    addAddress(input: AddressInput!): User!
    updateRiderAvailability(isAvailable: Boolean!): User!

    # Restaurant
    createRestaurant(input: RestaurantInput!): Restaurant!
    updateRestaurant(id: ID!, input: RestaurantInput!): Restaurant!
    updateRestaurantStatus(id: ID!, status: RestaurantStatus!): Restaurant!
    toggleRestaurantOpen(id: ID!): Restaurant!

    # Menu Item
    createMenuItem(restaurantId: ID!, input: MenuItemInput!): MenuItem!
    updateMenuItem(id: ID!, input: MenuItemInput!): MenuItem!
    deleteMenuItem(id: ID!): Boolean!
    toggleMenuItemAvailability(id: ID!): MenuItem!

    # Order
    createOrder(input: CreateOrderInput!): Order!
    updateOrderStatus(id: ID!, status: OrderStatus!): Order!
    assignRider(orderId: ID!, riderId: ID!): Order!
    acceptDelivery(orderId: ID!): Order!
    cancelOrder(id: ID!, reason: String): Order!

    # Review
    createReview(input: ReviewInput!): Review!
    respondToReview(reviewId: ID!, response: String!): Review!

    # Chat
    sendMessage(text: String!): ChatMessage!
  }

  # Subscriptions
  type Subscription {
    orderStatusChanged(orderId: ID!): Order!
    newOrder(restaurantId: ID!): Order!
    newDeliveryRequest: Order!
  }
`;
