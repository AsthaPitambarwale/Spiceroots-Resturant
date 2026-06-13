# SpiceRoots - Food Delivery Platform

A fully-featured, modern food delivery web application built with React, TypeScript, and Tailwind CSS. Inspired by leading platforms like Swiggy and Zomato, featuring real-time order tracking, table reservations, offers management, and a comprehensive admin dashboard.

## Features

### Customer Features

#### Browse Menu
- **130+ Authentic Indian Dishes** across 14 categories
- **Veg/Non-Veg Classification** with visual indicators (79 veg, 51 non-veg)
- **Smart Search & Filters** - Search by name, filter by category and diet type
- **Pagination** - Browse 12 items per page for optimal performance
- **Rating & Reviews** - View ratings and customer reviews for each dish

#### Shopping & Checkout
- **Shopping Cart** - Add items, adjust quantities, view real-time totals
- **Smart Checkout** - City verification, phone validation, delivery instructions
- **Multiple Payment Options** - Razorpay (simulated) and Cash on Delivery
- **GST Calculation** - Automatic 5% GST on all orders
- **Delivery Fee** - Flat ₹40 delivery charge

#### Order Management
- **Real-time Order Tracking** - Progress bar with 4 stages (Placed → Preparing → On the way → Delivered)
- **Delivery Partner Details** - Name, phone, vehicle number, contact info
- **Estimated Delivery Time** - Live countdown to delivery
- **Order History** - View all past and current orders
- **Review & Rating** - Rate delivered orders with 1-5 stars and comments
<!-- - Live driver tracking with Google Maps
- Real-time WebSocket status updates
- Animated delivery route (like Uber Eats)
- Push notifications (order update alerts)
- Skeleton loading UI
- Expand/collapse order cards -->

#### Table Reservations
- **Visual Calendar Picker** - Interactive calendar for selecting dates
- **Meal Slots** - Choose from Breakfast, Lunch, or Dinner
- **Time Selection** - Available time slots with booking status
- **Guest Management** - Select 1-10 guests
- **Special Requests** - Add dietary restrictions or occasion notes
- **Confirmation** - Instant booking confirmation with details

#### Offers & Promotions
- **Multiple Coupon Codes** - FIRST50, WELCOME25, SPICE20, etc.
- **Discount Types** - Percentage off and flat discounts
- **Category-Specific Offers** - Special deals on specific food categories
- **One-Click Copy** - Easy copy to clipboard functionality
- **Minimum Order Requirements** - Clear indication of order thresholds

#### Notifications
- **Real-time Updates** - Order status, new menu items, promotions
- **Unread Count Badge** - Visual indicator for new notifications
- **Mark as Read** - Easy notification management
- **Detailed Information** - Full details for each notification

#### User Profile
- **Personal Information** - Edit name, email, phone, address
- **Order Statistics** - Total orders, total spent, delivered orders, average order value
- **Animated Stats Cards** - Visual representation with hover effects
- **Quick Actions** - View orders, logout

#### Theme Support
- **Dark/Light Mode** - Toggle between themes
- **Persistent Preference** - Theme choice saved locally
- **Smooth Transitions** - Animated theme switching

### Admin Features

#### Dashboard
- **Analytics Overview** - Total revenue, orders, customers
- **Sales Trend Charts** - Line and bar charts showing last 7 days
- **Category Sales** - Pie chart breakdown by category
- **Recent Orders** - Real-time order table with status
- **Quick Stats** - Key metrics at a glance

#### Food Management
- **Add/Edit/Delete** - Full CRUD operations for menu items
- **Image Upload** - Add images for each dish
- **Category Assignment** - Organize items into categories
- **Price Management** - Update pricing and descriptions
- **Veg/Non-Veg** - Mark dietary classification

#### Category Management
- **Create Categories** - Add new food categories
- **Edit Categories** - Update category details
- **Delete Categories** - Remove unused categories

#### Order Management
- **View All Orders** - Complete order list
- **Update Status** - Change order status in real-time
- **Filter by Status** - View pending, preparing, delivered orders
- **Assign Partners** - Assign delivery partners to orders
- **Customer Details** - Access customer contact information

#### Customer Management
- **Customer List** - View all registered customers
- **Order History** - See customer purchase history
- **Statistics** - Total orders and spending per customer
- **Contact Info** - Access customer details

#### Sales Reports
- **Date Range Filters** - Daily, weekly, monthly views
- **Revenue Charts** - Visual sales trends
- **Top-Selling Items** - Ranking by popularity
- **Category Breakdown** - Sales by food category
- **Export Ready** - Data formatted for reporting

## Tech Stack

### Frontend
- **React 18.3.1** - Modern UI library with TypeScript
- **React Router 7.x** - Client-side routing and navigation
- **Tailwind CSS 4.0** - Utility-first CSS framework with dark mode
- **Framer Motion** - Smooth animations and transitions
- **React Calendar 6.0.1** - Visual date picker for reservations
- **Recharts** - Interactive charts and data visualization
- **Lucide React** - Modern icon library (500+ icons)
- **Sonner** - Beautiful toast notifications

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, minimalist web framework
- **MongoDB** - NoSQL database with Atlas cloud hosting
- **Mongoose** - MongoDB object modeling and schema validation
- **JWT** - JSON Web Tokens for secure authentication
- **bcryptjs** - Password hashing and encryption
- **express-validator** - Request validation middleware
- **cors** - Cross-Origin Resource Sharing support

### State Management
- **Context API** - Global state management
  - AppContext - Authentication, cart, orders
  - ThemeContext - Dark/light mode
  - NotificationContext - Real-time notifications
- **API Service Layer** - Centralized API communication
- **Local Storage** - JWT token storage and preferences

### Build Tools
- **Vite** - Fast development and build tool
- **TypeScript** - Type-safe JavaScript
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Nodemon** - Auto-restart development server

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- MongoDB Atlas account (free tier available)

### Quick Start

**📖 For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)**

### Frontend Only (Mock Data)

1. Clone the repository
```bash
git clone <repository-url>
cd code
```

2. Install dependencies
```bash
pnpm install
```

3. Start the development server
```bash
pnpm run dev
```

The app will run with mock data (no backend required).

### Full Stack Setup (Frontend + Backend + MongoDB)

#### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pnpm install

# Create .env file and configure MongoDB Atlas connection
cp .env.example .env
# Edit .env and add your MongoDB connection string

# Seed database with 130 food items, categories, users, and offers
pnpm run seed

# Start backend server (port 5000)
pnpm run dev
```

#### 2. Frontend Setup

```bash
# In a new terminal, navigate to project root
cd ..

# Install dependencies (if not already done)
pnpm install

# Start frontend development server
pnpm run dev
```

### Build for Production

```bash
# Frontend
pnpm run build
pnpm run preview

# Backend
cd backend
pnpm start
```

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── admin/              # Admin panel components
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── ManageFoods.tsx
│   │   │   ├── ManageCategories.tsx
│   │   │   ├── ManageOrders.tsx
│   │   │   ├── ManageCustomers.tsx
│   │   │   └── SalesReports.tsx
│   │   ├── pages/              # Customer page components
│   │   │   ├── Home.tsx
│   │   │   ├── Menu.tsx
│   │   │   ├── Cart.tsx
│   │   │   ├── Checkout.tsx
│   │   │   ├── OrderTracking.tsx
│   │   │   ├── Reservations.tsx
│   │   │   ├── Offers.tsx
│   │   │   ├── Notifications.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   └── Layout.tsx          # Main layout with header/footer
│   ├── context/
│   │   ├── AppContext.tsx      # Auth, cart, orders state
│   │   ├── ThemeContext.tsx    # Dark/light mode
│   │   └── NotificationContext.tsx  # Notifications
│   ├── data/
│   │   ├── indianFoodData.ts   # 130+ food items with veg/non-veg
│   │   └── mockData.ts         # Categories, cities, partners
│   ├── routes.tsx              # React Router configuration
│   └── App.tsx                # Root component
├── styles/
│   ├── theme.css              # CSS custom properties & base styles
│   └── fonts.css              # Font imports
└── main.tsx                   # Application entry point
```

## Available Pages

### Customer Routes
- **/** - Home page with hero section and features
- **/menu** - Browse food items with filters and pagination
- **/cart** - Shopping cart with totals and checkout
- **/checkout** - Order placement with delivery details
- **/orders** - Track active and past orders
- **/reservations** - Book tables with visual calendar
- **/offers** - View and apply discount coupons
- **/notifications** - View all notifications
- **/profile** - User profile and order statistics
- **/login** - User authentication
- **/register** - New user registration

### Admin Routes
- **/admin** - Admin login page
- **/admin/dashboard** - Analytics overview
- **/admin/dashboard/foods** - Manage menu items
- **/admin/dashboard/categories** - Manage categories
- **/admin/dashboard/orders** - Order management
- **/admin/dashboard/customers** - Customer management
- **/admin/dashboard/reports** - Sales reports with charts

## Backend API

### Architecture

The backend follows a modern MVC architecture with the following components:

**Backend Structure:**
```
backend/
├── config/          # Database configuration
├── controllers/     # Business logic
├── middleware/      # Auth & error handling
├── models/          # MongoDB schemas
├── routes/          # API endpoints
├── seed.js         # Database seeder
└── server.js       # Express app
```

### API Endpoints

**Base URL:** `http://localhost:5000/api`

#### Authentication
- POST `/auth/register` - Register new user
- POST `/auth/login` - Login user
- GET `/auth/me` - Get current user (protected)

#### Foods
- GET `/foods` - Get all foods (with filters)
- GET `/foods/:id` - Get food by ID
- POST `/foods` - Create food (admin)
- PUT `/foods/:id` - Update food (admin)
- DELETE `/foods/:id` - Delete food (admin)

#### Orders
- POST `/orders` - Create order (protected)
- GET `/orders/my-orders` - Get user orders (protected)
- GET `/orders/:id` - Get order (protected)
- PUT `/orders/:id/status` - Update status (admin)

#### Reservations
- POST `/reservations` - Create reservation (protected)
- GET `/reservations/my-reservations` - Get user reservations (protected)

#### More Endpoints
- See [backend/README.md](backend/README.md) for complete API documentation

### Database Schema

**MongoDB Collections:**
- Users (customers & admins)
- Foods (130 items with categories)
- Categories (10 categories)
- Orders (with items, delivery info, status)
- Reservations (date, time, guests)
- Notifications (user alerts)
- Offers (coupons and discounts)
- Reviews (ratings and comments)

### Authentication

The API uses JWT (JSON Web Tokens) for authentication.

**Using the API:**
1. Login to get JWT token
2. Include token in Authorization header:
   ```
   Authorization: Bearer <your-jwt-token>
   ```
3. Access protected routes

## Color Theme

The application uses a modern **blue/purple color scheme** for a professional and clean look.

### Light Mode
- **Primary:** Blue (#3b82f6)
- **Secondary:** Purple (#8b5cf6)
- **Background:** White (#ffffff)
- **Text:** Slate (#1e293b)
- **Accent:** Light Blue (#dbeafe)

### Dark Mode
- **Primary:** Light Blue (#60a5fa)
- **Secondary:** Light Purple (#a78bfa)
- **Background:** Dark Slate (#0f172a, #1e293b)
- **Text:** Light (#f1f5f9)
- **Accent:** Dark Blue (#1e3a8a)

### Additional Colors
- **Success:** Green (veg indicator)
- **Danger:** Red (non-veg indicator)
- **Warning:** Amber
- **Info:** Cyan

## Data Details

### Food Items (130 Total)
- **79 Vegetarian Items:** Paneer dishes, vegetables, lentils, breads, South Indian, desserts, beverages
- **51 Non-Vegetarian Items:** Chicken, mutton, fish, seafood, egg dishes

### Categories (14 Total)
1. Appetizers (Starters)
2. Tandoori & Grilled
3. North Indian Curries
4. South Indian
5. Biryani & Rice
6. Bread (Roti/Naan)
7. Street Food
8. Accompaniments (Raita, Chutney, etc.)
9. Seafood
10. Desserts (Sweets)
11. Beverages (Drinks)
12. Dal (Lentils)
13. Regional Specialties
14. Fusion & Indo-Chinese

### Service Cities (10)
Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad, Jaipur, Surat

## Key Features in Detail

### Veg/Non-Veg Classification
Every food item has a clear dietary indicator:
- **Green square icon** - Vegetarian
- **Red square icon** - Non-vegetarian
- Proper classification based on ingredients
- Filter menu by diet preference

### Table Reservation Flow
1. Select date from visual calendar (minimum tomorrow)
2. Choose meal slot (Breakfast, Lunch, Dinner)
3. Select available time slot
4. Enter number of guests (1-10)
5. Provide personal details and special requests
6. Get instant confirmation

### Order Tracking Stages
1. **Placed** - Order received and confirmed
2. **Preparing** - Kitchen is preparing your food
3. **On the way** - Delivery partner picked up order
4. **Delivered** - Order successfully delivered

### Notification Types
- Order status updates
- New menu items
- Special offers and discounts
- Promotional campaigns
- Booking confirmations

## Animations

Powered by Framer Motion for smooth user experience:
- **Page Transitions** - Smooth navigation
- **Hover Effects** - Interactive cards and buttons
- **Number Counters** - Animated statistics
- **Modal Animations** - Slide and fade effects
- **Loading States** - Skeleton screens
- **Stagger Lists** - Sequential item animations
- **Scale Effects** - Button clicks and selections

## Responsive Design

Fully responsive across all devices:
- **Mobile** - 320px to 767px
- **Tablet** - 768px to 1023px
- **Laptop** - 1024px to 1279px
- **Desktop** - 1280px and above

Optimized touch targets, readable fonts, and accessible navigation on all screen sizes.

## Browser Support

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Code splitting with React lazy loading
- Optimized images
- Memoized components
- Efficient re-renders with React.memo
- Debounced search
- Paginated lists
- Lazy loaded routes

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management
- Color contrast compliance
- Screen reader friendly

## Project Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup instructions for frontend and backend
- **[backend/README.md](backend/README.md)** - Backend API documentation
- **[ATTRIBUTIONS.md](ATTRIBUTIONS.md)** - Credits and attributions

## Future Enhancements

### Backend Features ✅ COMPLETED
- ✅ Node.js/Express API server
- ✅ MongoDB Atlas database
- ✅ RESTful API endpoints
- ✅ JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Database seeding script
- ✅ API service layer in frontend

### Advanced Features (Planned)
- Real payment gateway (Razorpay production mode)
- Google Maps live tracking integration
- SMS/Email notifications via Twilio/SendGrid
- Push notifications (Progressive Web App)
- Multi-language support (i18n)
- Social media login (OAuth)
- Loyalty points system
- Referral program with rewards
- Advanced analytics dashboard
- Mobile app (React Native)
- Image upload to cloud storage (AWS S3/Cloudinary)
- WebSocket real-time updates

### Business Features (Planned)
- Inventory management system
- Multi-restaurant support
- Dynamic pricing engine
- Surge pricing during peak hours
- Delivery zone management
- Restaurant hours and holidays
- Bulk order handling
- Corporate accounts
- Subscription plans

## Troubleshooting

### Common Issues

**Development server not starting:**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm run dev
```

**TypeScript errors:**
```bash
pnpm run typecheck
```

**Build errors:**
```bash
pnpm run build --verbose
```

## Contributing

This is a demonstration project. For educational purposes, feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is created for educational and demonstration purposes.

## Credits & Acknowledgments

- **Design Inspiration:** Swiggy, Zomato
- **Icons:** Lucide React
- **Charts:** Recharts
- **Animations:** Framer Motion
- **UI Framework:** Tailwind CSS
- **Food Data:** Authentic Indian cuisine references

---

**SpiceRoots** - Bringing authentic Indian flavors to your doorstep across 10 major cities!

Made with ❤️ for food lovers everywhere.



