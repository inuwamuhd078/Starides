# Starides Web Application

Premium React web application for the Starides food delivery system.

## Features

- 🎨 **Premium Dark Theme** - Modern, beautiful UI with glassmorphism effects
- 🚀 **Lightning Fast** - Built with Vite for optimal performance
- 🔐 **Secure Authentication** - JWT-based auth with role-based access control
- 📱 **Fully Responsive** - Works perfectly on all devices
- ⚡ **Real-time Updates** - GraphQL subscriptions for live order tracking
- 🎯 **Type-Safe** - Full TypeScript support

## Tech Stack

- **React 18** - Latest React with hooks
- **TypeScript** - Type safety throughout
- **Vite** - Next-generation frontend tooling
- **Apollo Client** - GraphQL client with caching
- **React Router** - Client-side routing
- **CSS Modules** - Scoped styling with custom properties

## Prerequisites

- Node.js 18+ installed
- Backend server running on `http://localhost:4000`

## Setup Instructions

1. **Install Dependencies**
   
   Note: If you encounter PowerShell execution policy errors, you can:
   - Use Command Prompt instead of PowerShell
   - Or run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
   
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:5173`

3. **Build for Production**
   ```bash
   npm run build
   npm run preview
   ```

## Project Structure

```
starides-web/
├── src/
│   ├── components/       # Reusable UI components
│   ├── context/          # React context providers
│   ├── graphql/          # GraphQL queries and mutations
│   ├── lib/              # Apollo Client setup
│   ├── pages/            # Page components
│   │   ├── Landing/      # Landing page
│   │   ├── Customer/     # Customer dashboard (to be implemented)
│   │   ├── Vendor/       # Vendor dashboard (to be implemented)
│   │   ├── Rider/        # Rider dashboard (to be implemented)
│   │   └── Admin/        # Admin dashboard (to be implemented)
│   ├── App.tsx           # Main app component with routing
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles and design system
├── index.html            # HTML template
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── vite.config.ts        # Vite config
```

## User Roles & Dashboards

### Customer
- Browse restaurants
- View menus and place orders
- Track order status in real-time
- View order history
- Leave reviews and ratings

### Vendor
- Manage restaurant profile
- Create and update menu items
- Receive and process orders
- View sales analytics
- Respond to customer reviews

### Rider
- View available deliveries
- Accept delivery requests
- Update delivery status
- Track earnings
- View delivery history

### Admin
- Manage all users
- Approve/reject restaurants
- Monitor platform analytics
- Handle support tickets
- System configuration

## Design System

The app uses a comprehensive design system with:

- **Color Palette**: Premium dark theme with vibrant accents
- **Typography**: Inter for body text, Outfit for headings
- **Spacing**: Consistent spacing scale (xs to 3xl)
- **Shadows**: Multiple shadow levels with glow effects
- **Animations**: Smooth transitions and micro-interactions
- **Components**: Pre-styled buttons, inputs, cards, badges

### CSS Custom Properties

All design tokens are available as CSS custom properties:

```css
var(--color-primary)      /* Primary brand color */
var(--color-bg-primary)   /* Background color */
var(--spacing-md)         /* Medium spacing */
var(--radius-lg)          /* Large border radius */
var(--shadow-lg)          /* Large shadow */
```

## Authentication

The app uses JWT tokens stored in localStorage. The auth flow:

1. User registers or logs in
2. Backend returns JWT token and user data
3. Token is stored and sent with all GraphQL requests
4. Protected routes check authentication and role

## GraphQL Integration

Apollo Client is configured with:

- HTTP link to backend GraphQL endpoint
- Authentication middleware
- In-memory cache
- Cache-and-network fetch policy

Example query:

```typescript
import { useQuery } from '@apollo/client';
import { GET_RESTAURANTS } from './graphql/queries';

const { data, loading, error } = useQuery(GET_RESTAURANTS, {
  variables: { status: 'APPROVED' }
});
```

## Development Notes

### Current Status

✅ **Completed:**
- Project setup with Vite and TypeScript
- Apollo Client configuration
- Authentication context and flow
- Premium design system
- Landing page with hero, features, and CTA
- Routing with protected routes

🚧 **In Progress:**
- Customer dashboard
- Vendor dashboard
- Rider dashboard
- Admin dashboard

### Next Steps

1. Implement authentication pages (Login/Register)
2. Build customer restaurant browsing and ordering
3. Create vendor restaurant management interface
4. Develop rider delivery management system
5. Build admin control panel

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

This is a demonstration project for the Starides food delivery system.

## License

ISC
