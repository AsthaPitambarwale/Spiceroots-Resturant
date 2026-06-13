# SpiceRoots Backend API

RESTful API built with Node.js, Express, and MongoDB for the SpiceRoots food delivery platform.

## Features

- **User Authentication** - JWT-based auth with bcrypt password hashing
- **Food Management** - CRUD operations for 130+ Indian dishes
- **Category Management** - Organize foods into 10 categories
- **Order System** - Create, track, and manage orders
- **Table Reservations** - Book tables with date/time selection
- **Notifications** - Real-time updates for users
- **Offers & Coupons** - Discount management system
- **Reviews & Ratings** - Customer feedback system
- **Admin Panel** - Complete backend support for admin operations

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── foodController.js     # Food CRUD operations
│   ├── categoryController.js # Category management
│   ├── orderController.js    # Order processing
│   ├── reservationController.js
│   ├── notificationController.js
│   ├── offerController.js
│   └── reviewController.js
├── middleware/
│   ├── auth.js               # JWT authentication
│   └── errorHandler.js       # Error handling
├── models/
│   ├── User.js               # User schema
│   ├── Food.js               # Food item schema
│   ├── Category.js           # Category schema
│   ├── Order.js              # Order schema
│   ├── Reservation.js        # Reservation schema
│   ├── Notification.js       # Notification schema
│   ├── Offer.js              # Offer/coupon schema
│   └── Review.js             # Review schema
├── routes/
│   ├── auth.js               # Auth routes
│   ├── foods.js              # Food routes
│   ├── categories.js         # Category routes
│   ├── orders.js             # Order routes
│   ├── reservations.js       # Reservation routes
│   ├── notifications.js      # Notification routes
│   ├── offers.js             # Offer routes
│   └── reviews.js            # Review routes
├── .env                      # Environment variables
├── .env.example              # Environment template
├── package.json              # Dependencies
├── seed.js                   # Database seeder
└── server.js                 # Express app entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- npm or pnpm package manager

### Installation

1. Navigate to backend directory
```bash
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB Atlas connection string:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/spice-kitchen?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:5173
```

### MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new cluster (free tier M0 available)
4. Create a database user with password
5. Whitelist your IP address (or use 0.0.0.0/0 for development)
6. Get your connection string and add it to `.env`

### Seed Database

Populate the database with 130 food items, categories, demo users, and offers:

```bash
npm run seed
```

This will create:
- 10 Categories
- 130 Food items (79 veg, 51 non-veg)
- 2 Demo users (customer and admin)
- 5 Sample offers

### Run Development Server

```bash
npm run dev
```

Server will start on `http://localhost:5000`

### Run Production Server

```bash
npm start
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Protected |

### Foods

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/foods` | Get all foods | Public |
| GET | `/api/foods/:id` | Get food by ID | Public |
| POST | `/api/foods` | Create food | Admin |
| PUT | `/api/foods/:id` | Update food | Admin |
| DELETE | `/api/foods/:id` | Delete food | Admin |

### Categories

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/categories` | Get all categories | Public |
| GET | `/api/categories/:id` | Get category | Public |
| POST | `/api/categories` | Create category | Admin |
| PUT | `/api/categories/:id` | Update category | Admin |
| DELETE | `/api/categories/:id` | Delete category | Admin |

### Orders

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/orders` | Create order | Protected |
| GET | `/api/orders/my-orders` | Get user orders | Protected |
| GET | `/api/orders/:id` | Get order by ID | Protected |
| GET | `/api/orders` | Get all orders | Admin |
| PUT | `/api/orders/:id/status` | Update order status | Admin |
| PUT | `/api/orders/:id/delivery-partner` | Assign delivery partner | Admin |

### Reservations

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/reservations` | Create reservation | Protected |
| GET | `/api/reservations/my-reservations` | Get user reservations | Protected |
| GET | `/api/reservations` | Get all reservations | Admin |
| PUT | `/api/reservations/:id/status` | Update status | Admin |

### Notifications

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/notifications` | Get user notifications | Protected |
| PUT | `/api/notifications/:id/read` | Mark as read | Protected |
| POST | `/api/notifications` | Create notification | Admin |

### Offers

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/offers` | Get active offers | Public |
| GET | `/api/offers/code/:code` | Get offer by code | Public |
| POST | `/api/offers` | Create offer | Admin |
| PUT | `/api/offers/:id` | Update offer | Admin |
| DELETE | `/api/offers/:id` | Delete offer | Admin |

### Reviews

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/reviews` | Create review | Protected |
| GET | `/api/reviews/food/:foodId` | Get food reviews | Public |
| GET | `/api/reviews/my-reviews` | Get user reviews | Protected |

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Login Flow

1. User sends credentials to `/api/auth/login`
2. Server validates and returns JWT token
3. Client stores token (localStorage/sessionStorage)
4. Client sends token in Authorization header for protected routes

### Protected Routes

Include JWT token in request header:

```
Authorization: Bearer <your-jwt-token>
```

## Demo Accounts

After running `npm run seed`, you can use these accounts:

**Customer Account:**
- Email: `customer@example.com`
- Password: `password`

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: String,
  city: String,
  role: 'customer' | 'admin',
  timestamps
}
```

### Food
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: ObjectId (ref: Category),
  categoryName: String,
  image: String,
  rating: Number (0-5),
  reviews: Number,
  isVegetarian: Boolean,
  isAvailable: Boolean,
  timestamps
}
```

### Order
```javascript
{
  user: ObjectId (ref: User),
  items: [{food, name, quantity, price, image}],
  totalAmount: Number,
  paymentStatus: 'pending' | 'completed' | 'failed',
  paymentMethod: 'online' | 'cod',
  orderStatus: 'pending' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled',
  customerName: String,
  customerPhone: String,
  deliveryAddress: String,
  deliveryCity: String,
  deliveryPartner: {name, phone, vehicle},
  timestamps
}
```

### Category
```javascript
{
  name: String (unique),
  description: String,
  icon: String,
  timestamps
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "stack": "Stack trace (development only)"
}
```

HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| MONGODB_URI | MongoDB connection string | Required |
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| JWT_SECRET | JWT signing secret | Required |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:5173 |

## Development Scripts

```bash
# Install dependencies
npm install

# Run development server with nodemon
npm run dev

# Run production server
npm start

# Seed database
npm run seed
```

## Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Configure production MongoDB cluster
4. Set proper CORS origins
5. Enable MongoDB IP whitelist

### Recommended Platforms

- **Heroku** - Easy deployment with MongoDB Atlas
- **Railway** - Modern platform with MongoDB support
- **DigitalOcean App Platform** - Managed Node.js hosting
- **AWS EC2** - Full control over server
- **Vercel/Netlify** - Serverless functions

## Security Best Practices

- ✅ Passwords hashed with bcrypt
- ✅ JWT token authentication
- ✅ CORS configured
- ✅ Input validation with express-validator
- ✅ MongoDB injection prevention (Mongoose)
- ✅ Environment variables for secrets
- ⚠️ Add rate limiting for production
- ⚠️ Add helmet.js for security headers
- ⚠️ Add request logging (morgan)

## Troubleshooting

### MongoDB Connection Failed

- Check connection string format
- Verify database user credentials
- Ensure IP whitelist includes your IP
- Check network connectivity

### JWT Token Invalid

- Verify JWT_SECRET matches frontend
- Check token expiration (30 days)
- Ensure Bearer prefix in header

### Port Already in Use

- Change PORT in .env file
- Kill process using port 5000:
  ```bash
  lsof -ti:5000 | xargs kill -9
  ```

## License

This project is created for educational purposes.

## Support

For issues or questions, check the main project README or open an issue on GitHub.
