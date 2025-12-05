# Starides - Food Delivery Platform

A full-stack food delivery platform built with React, TypeScript, Node.js, GraphQL, and MongoDB.

## 🚀 Features

### Customer Features
- Browse restaurants and menus
- Add items to cart
- Place orders
- Track order status
- View order history

### Vendor Features
- Restaurant management
- Menu item creation and management
- Order tracking
- Analytics dashboard with revenue charts

### Admin Features
- User management
- Restaurant approval
- Platform analytics
- Order monitoring

### Rider Features
- Delivery management
- Earnings tracking
- Available deliveries

## 🛠️ Tech Stack

### Frontend
- **React** with TypeScript
- **Apollo Client** for GraphQL
- **React Router** for navigation
- **Recharts** for analytics visualization
- **Vite** for build tooling

### Backend
- **Node.js** with Express
- **Apollo Server** for GraphQL API
- **MongoDB** with Mongoose
- **JWT** for authentication
- **TypeScript**

## 📦 Project Structure

```
starides/
├── starides-web/          # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── graphql/       # GraphQL queries and mutations
│   │   └── lib/           # Utility libraries
│   └── package.json
│
└── starides-backend/      # Backend GraphQL API
    ├── src/
    │   ├── models/        # MongoDB models
    │   ├── resolvers/     # GraphQL resolvers
    │   ├── schemas/       # GraphQL type definitions
    │   └── middleware/    # Authentication middleware
    └── package.json
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/inuwamuhd078/starides.git
   cd starides
   ```

2. **Install Backend Dependencies**
   ```bash
   cd starides-backend
   npm install
   ```

3. **Configure Backend Environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration:
   ```
   PORT=4000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Install Frontend Dependencies**
   ```bash
   cd ../starides-web
   npm install
   ```

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd starides-backend
   npm run dev
   ```
   Backend will run on `http://localhost:4000`

3. **Start Frontend Development Server**
   ```bash
   cd starides-web
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## 🎨 Design Features

- **Sky Blue Theme** - Modern, vibrant color palette
- **Responsive Design** - Works on all devices
- **Smooth Animations** - Enhanced user experience
- **Analytics Charts** - Visual data representation using Recharts
- **Glassmorphism Effects** - Premium UI design

## 📊 Analytics

The platform includes analytics dashboards for:
- **Vendors**: Revenue tracking, order statistics
- **Admins**: Platform-wide metrics, user statistics

## 🔐 Authentication

- JWT-based authentication
- Role-based access control (Customer, Vendor, Rider, Admin)
- Protected routes and API endpoints

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**inuwamuhd078**
- GitHub: [@inuwamuhd078](https://github.com/inuwamuhd078)
- Email: inuwamuhammad078@gmail.com

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by popular food delivery platforms
- Designed for scalability and performance
