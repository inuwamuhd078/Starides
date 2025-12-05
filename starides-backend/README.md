# Starides Backend

GraphQL backend server for the Starides food delivery system.

## Prerequisites

- Node.js 18+ installed
- MongoDB installed and running locally (or MongoDB Atlas connection string)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   
   Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

   Update the `.env` file with your configuration:
   ```env
   PORT=4000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/starides
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:5173
   ```

3. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   mongod
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

   The server will start at `http://localhost:4000/graphql`

5. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

- **GraphQL API**: `http://localhost:4000/graphql`
- **Health Check**: `http://localhost:4000/health`

## GraphQL Schema

### User Roles
- `CUSTOMER` - Can browse restaurants, place orders, and leave reviews
- `VENDOR` - Can manage restaurants and menu items
- `RIDER` - Can accept and deliver orders
- `ADMIN` - Full system access

### Key Features

#### Authentication
- `register(input: RegisterInput!)` - Create new user account
- `login(input: LoginInput!)` - Login and get JWT token
- `me` - Get current user profile

#### Restaurants
- `restaurants` - List all restaurants
- `nearbyRestaurants(latitude, longitude, radius)` - Find restaurants near location
- `createRestaurant` - Vendor creates restaurant
- `updateRestaurant` - Update restaurant details
- `updateRestaurantStatus` - Admin approves/rejects restaurants

#### Menu Items
- `menuItems(restaurantId)` - Get restaurant menu
- `createMenuItem` - Add menu item
- `updateMenuItem` - Update menu item
- `toggleMenuItemAvailability` - Mark item as available/unavailable

#### Orders
- `createOrder` - Customer places order
- `myOrders` - Customer's order history
- `restaurantOrders` - Vendor's incoming orders
- `availableDeliveries` - Rider sees available deliveries
- `updateOrderStatus` - Update order status
- `acceptDelivery` - Rider accepts delivery

#### Reviews
- `createReview` - Customer reviews order
- `reviews(restaurantId)` - Get restaurant reviews
- `respondToReview` - Vendor responds to review

#### Stats
- `adminStats` - Platform-wide statistics
- `restaurantStats(restaurantId)` - Restaurant performance metrics

## Database Models

- **User** - User accounts with role-based fields
- **Restaurant** - Restaurant profiles and settings
- **MenuItem** - Food items with dietary information
- **Order** - Order transactions and tracking
- **Review** - Customer feedback and ratings

## Authorization

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

Role-based access control is enforced on all mutations and sensitive queries.

## Development

- TypeScript for type safety
- Mongoose for MongoDB ODM
- Apollo Server for GraphQL
- JWT for authentication
- bcrypt for password hashing

## Testing the API

Use GraphQL Playground or any GraphQL client to test the API at `http://localhost:4000/graphql`

Example mutation to register:
```graphql
mutation {
  register(input: {
    email: "customer@example.com"
    password: "password123"
    firstName: "John"
    lastName: "Doe"
    phone: "+1234567890"
    role: CUSTOMER
  }) {
    token
    user {
      id
      email
      firstName
      role
    }
  }
}
```
