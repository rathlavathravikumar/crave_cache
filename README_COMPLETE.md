# CraveCache - Production-Ready MERN Stack Application

## 🚀 Project Overview

**CraveCache** is a modern, AI-powered food ordering platform built with the MERN stack. It provides a seamless experience for customers to discover restaurants, browse menus, place orders, make secure payments, and track deliveries - similar to Swiggy, Zomato, Uber Eats, or DoorDash.

### Key Features

- **Smart Food Discovery**: Browse restaurants, filter by cuisines, price, ratings
- **AI-Powered Recommendations**: Personalized food suggestions based on mood, budget, diet
- **Secure Authentication**: JWT-based user authentication with email verification
- **Shopping Cart & Checkout**: Add items, apply coupons, calculate taxes
- **Stripe Payment Integration**: Secure credit card payments
- **Order Tracking**: Real-time order status updates
- **Restaurant Management**: Admin panel for restaurant owners
- **User Dashboard**: Profile management, order history, saved addresses
- **Responsive Design**: Works flawlessly on desktop, tablet, and mobile
- **Dark Mode Support**: Premium dark theme option

---

## 📊 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast builds
- **Redux Toolkit** for state management
- **React Router v7** for navigation
- **Framer Motion** for animations
- **Lucide React** for icons
- **Axios** for API calls
- **CSS3** with design system tokens

### Backend
- **Node.js & Express.js** (v5.2.1)
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Cloudinary** for image storage
- **Stripe API** for payments
- **Groq API** for AI features (Llama 3)
- **Nodemailer** for emails

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas
- **Storage**: Cloudinary
- **Payments**: Stripe

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB Atlas account
- Stripe account
- Cloudinary account
- Groq API key

### Backend Setup

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env

# 3. Add your environment variables to .env
# - MONGO_URI: MongoDB connection string
# - JWT_SECRET: Your JWT secret key
# - STRIPE_API_KEY: Stripe publishable key
# - CLOUDINARY_*: Cloudinary credentials
# - GROQ_API_KEY: Groq API key
# - SMTP_*: Email configuration

# 4. Run the server
npm run dev
# Server will run on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Create .env file (optional for frontend)
# Copy environment variables if needed

# 3. Start the development server
npm run dev
# App will run on http://localhost:5173
```

---

## 📁 Project Structure

### Backend (`/backend`)

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/              # Business logic
│   ├── authController.js
│   ├── restaurantController.js
│   ├── foodItemController.js
│   ├── cartController.js
│   ├── orderController.js
│   ├── paymentController.js
│   └── aiController.js
├── middlewares/              # Express middlewares
│   ├── auth.js              # JWT verification
│   ├── catchAsyncErrors.js  # Error handling wrapper
│   ├── error.js             # Global error handler
│   └── rateLimiter.js       # Rate limiting
├── models/                  # MongoDB schemas
│   ├── user.js
│   ├── restaurant.js
│   ├── foodItem.js
│   ├── menu.js
│   ├── order.js
│   ├── cart.js
│   ├── review.js
│   ├── coupon.js
│   ├── category.js
│   ├── payment.js
│   └── notification.js
├── routes/                  # API routes
│   ├── auth.js
│   ├── restaurant.js
│   ├── foodItem.js
│   ├── menu.js
│   ├── cart.js
│   ├── order.js
│   ├── ai.js
│   └── payment.js
├── utils/                   # Utility functions
│   ├── errorHandler.js
│   ├── jwtToken.js
│   ├── validators.js
│   └── fallbackData.js
├── server.js                # Express app setup
├── .env.example             # Environment variables example
└── package.json
```

### Frontend (`/frontend`)

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.tsx
│   │   ├── FoodCard.tsx
│   │   ├── RestaurantCard.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ui/              # UI component library
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Loading.tsx
│   │       ├── Error.tsx
│   │       └── index.ts
│   ├── pages/               # Page components
│   │   ├── HomePage.tsx
│   │   ├── RestaurantPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── OrdersPage.tsx
│   │   └── ProfilePage.tsx
│   ├── redux/               # Redux state management
│   │   ├── store.ts
│   │   ├── userSlice.ts
│   │   ├── cartSlice.ts
│   │   ├── orderSlice.ts
│   │   ├── restaurantSlice.ts
│   │   └── notificationSlice.ts
│   ├── styles/              # Global styles & design system
│   │   ├── globals.css
│   │   ├── pages.css
│   │   ├── design-system.css
│   │   ├── design-tokens.css
│   │   └── reset.css
│   ├── api.ts               # Axios API client
│   ├── types.ts             # TypeScript type definitions
│   ├── App.tsx              # Main app component
│   └── main.tsx             # React entry point
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 🔑 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/forgot-password` - Request password reset
- `PUT /api/v1/auth/reset-password/:token` - Reset password

### Restaurants
- `GET /api/v1/restaurants` - Get all restaurants
- `GET /api/v1/restaurants/:id` - Get restaurant details
- `POST /api/v1/restaurants` - Create restaurant (admin)
- `PUT /api/v1/restaurants/:id` - Update restaurant
- `DELETE /api/v1/restaurants/:id` - Delete restaurant

### Food Items
- `GET /api/v1/fooditems` - Get all food items
- `GET /api/v1/fooditems/:id` - Get food item details
- `POST /api/v1/fooditems` - Create food item
- `PUT /api/v1/fooditems/:id` - Update food item
- `DELETE /api/v1/fooditems/:id` - Delete food item

### Cart
- `GET /api/v1/cart` - Get user's cart
- `POST /api/v1/cart` - Add item to cart
- `PUT /api/v1/cart/:itemId` - Update cart item
- `DELETE /api/v1/cart/:itemId` - Remove item from cart

### Orders
- `GET /api/v1/orders` - Get user's orders
- `GET /api/v1/orders/:id` - Get order details
- `POST /api/v1/orders` - Create new order
- `PUT /api/v1/orders/:id/cancel` - Cancel order
- `GET /api/v1/orders/:id/track` - Track order status

### Payments
- `POST /api/v1/payment/process` - Process payment
- `GET /api/v1/payment/:orderId` - Get payment details
- `POST /api/v1/payment/webhook` - Stripe webhook

### AI Features
- `POST /api/v1/ai/recommendations` - Get food recommendations
- `POST /api/v1/ai/search` - AI-powered search
- `POST /api/v1/ai/describe` - Generate food descriptions

---

## 🔐 Security Features

✅ **Authentication & Authorization**
- JWT token-based authentication
- Password hashing with bcryptjs
- Protected routes with middleware
- Role-based access control (RBAC)

✅ **Data Protection**
- Input validation & sanitization
- SQL injection prevention
- XSS protection
- CSRF tokens

✅ **API Security**
- Rate limiting on auth endpoints
- Helmet.js for HTTP headers
- CORS configuration
- MongoDB sanitization

✅ **Sensitive Data**
- Environment variables for secrets
- JWT in httpOnly cookies
- Encrypted payment data
- HTTPS in production

---

## 🎨 Design System

### Color Palette
- **Primary**: #FF6B00 (Orange)
- **Secondary**: #121212 (Dark)
- **Success**: #10B981 (Green)
- **Warning**: #F59E0B (Amber)
- **Error**: #EF4444 (Red)

### Typography
- **Font**: Inter, system fonts fallback
- **Font Sizes**: xs(12px) to 5xl(48px)
- **Font Weights**: Regular(400) to Bold(700)
- **Line Heights**: tight(1.2) to relaxed(1.75)

### Spacing (8px base)
- 4px, 8px, 12px, 16px, 24px, 32px...

### Border Radius
- sm: 6px, md: 8px, lg: 12px, xl: 16px, full: 9999px

### Shadows
- sm, md, lg, xl, 2xl + glassmorphism

---

## 📱 Responsive Design

- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: < 768px

All components are fully responsive and tested across devices.

---

## 🚀 Deployment

### Frontend (Vercel)

```bash
# 1. Push code to GitHub
git push origin main

# 2. Connect repository to Vercel
# - Go to vercel.com
# - Import project from GitHub
# - Set environment variables
# - Deploy automatically

# 3. Or deploy manually
npm install -g vercel
vercel
```

### Backend (Render)

```bash
# 1. Create Render account and new Web Service
# 2. Connect GitHub repository
# 3. Add environment variables in Render dashboard
# 4. Deploy automatically on push

# Environment variables needed:
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_secret>
STRIPE_API_KEY=<your_stripe_key>
# ... and others from .env.example
```

### Database (MongoDB Atlas)

1. Create MongoDB Atlas cluster
2. Whitelist IP addresses
3. Create database user
4. Get connection string
5. Add to MONGO_URI in .env

---

## 📊 Database Schema

### Users
- Authentication credentials
- Profile information
- Addresses
- Payment preferences
- Notification settings

### Restaurants
- Basic information
- Ratings & reviews
- Opening hours
- Delivery details
- Menu categories

### Food Items
- Name, price, description
- Images & variants
- Nutrition information
- Allergens
- Availability

### Orders
- Items & quantities
- Delivery address
- Payment information
- Status tracking
- Timestamps

### Payments
- Transaction details
- Stripe integration
- Receipt information
- Refund tracking

---

## 🧪 Testing

```bash
# Frontend
npm run test

# Backend
npm test

# Linting
npm run lint
```

---

## 📝 Environment Variables

### Backend (.env)
See `.env.example` for complete list:
```
MONGO_URI=
JWT_SECRET=
PORT=5000
NODE_ENV=development
STRIPE_API_KEY=
CLOUDINARY_NAME=
GROQ_API_KEY=
...
```

### Frontend (optional .env)
```
VITE_API_URL=http://localhost:5000
```

---

## 🐛 Troubleshooting

### Backend Connection Issues
- Verify MongoDB URI in .env
- Check whitelist IP in MongoDB Atlas
- Ensure CORS is properly configured

### Frontend API Errors
- Verify backend is running on correct port
- Check API URL in axios config
- Review browser console for CORS errors

### Payment Issues
- Verify Stripe keys are correct
- Check Stripe webhook configuration
- Review payment logs in Stripe dashboard

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Express.js Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Stripe API Docs](https://stripe.com/docs)
- [Vite Documentation](https://vitejs.dev)

---

## 👥 Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request
4. Code review and merge

---

## 📄 License

MIT License - feel free to use this project for educational and commercial purposes.

---

## 🎯 Roadmap

- [ ] Mobile app with React Native
- [ ] Live chat support
- [ ] Loyalty program
- [ ] Restaurant analytics dashboard
- [ ] Enhanced AI recommendations
- [ ] Multi-language support
- [ ] Real-time order tracking with maps

---

**Built with ❤️ by the CraveCache Team**

For questions or support, contact: support@cravecache.com
