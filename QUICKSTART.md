# CraveCache - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- MongoDB Atlas account (free tier available)
- Stripe account (for payments)

### Step 1: Clone & Install Backend

```bash
cd backend
npm install
```

### Step 2: Setup Environment Variables

Create `.env` file in `/backend`:

```bash
# Minimum required for development
MONGO_URI=mongodb://localhost:27017/cravecache
# OR use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cravecache

JWT_SECRET=your_super_secret_key_here_change_this
PORT=5000
NODE_ENV=development

# Optional but recommended
STRIPE_API_KEY=sk_test_xxxxxxxxxxxx
CLOUDINARY_NAME=your_cloudinary_name
GROQ_API_KEY=your_groq_api_key
```

### Step 3: Start Backend

```bash
npm run dev
# Backend running on http://localhost:5000
```

### Step 4: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### Step 5: Start Frontend

```bash
npm run dev
# Frontend running on http://localhost:5173
```

### Step 6: Open in Browser

Navigate to `http://localhost:5173`

---

## 📚 Project Features to Explore

1. **Home Page** (`/`)
   - Browse restaurants
   - Search & filter foods
   - View cuisines

2. **Restaurant Page** (`/restaurants/:id`)
   - View menu items
   - Check ratings & reviews

3. **Cart** (`/cart`)
   - Add/remove items
   - Apply coupons

4. **Login/Register** (`/login`)
   - Create account
   - Authentication

5. **Orders** (`/orders`)
   - View order history
   - Track current orders

6. **Profile** (`/profile`)
   - Manage addresses
   - Edit preferences

---

## 🔧 Development Tips

### Code Structure
- All API calls go through `/frontend/src/api.ts`
- Redux store in `/frontend/src/redux/`
- Styles use design system variables
- Backend follows MVC pattern

### Adding New Features

**Frontend:**
1. Create component in `/components` or `/pages`
2. Add Redux slice if needed
3. Import design system CSS
4. Add routes in `App.tsx`

**Backend:**
1. Add model in `/models`
2. Create controller in `/controllers`
3. Add routes in `/routes`
4. Use middleware for validation

### Styling
- Use CSS variables: `var(--color-primary)`, `var(--spacing-4)`
- Check `/frontend/src/styles/globals.css` for all variables
- Follow mobile-first responsive design

---

## 🐛 Common Issues & Solutions

### Issue: Cannot connect to MongoDB
**Solution:**
1. Verify `MONGO_URI` in `.env`
2. For Atlas: Whitelist your IP address
3. Ensure username/password are correct

### Issue: Frontend can't reach backend
**Solution:**
1. Verify backend is running on port 5000
2. Check CORS is enabled in `backend/server.js`
3. Ensure `VITE_API_URL` is correct in frontend

### Issue: Stripe errors
**Solution:**
1. Use test keys (sk_test_*, pk_test_*)
2. Never commit real keys to git
3. Test with Stripe's test card: `4242 4242 4242 4242`

### Issue: Port already in use
**Solution:**
```bash
# Find process using port 5000
lsof -i :5000
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

---

## 📦 Production Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to vercel.com
3. Add environment variables
4. Deploy!

### Backend (Render)
1. Create account at render.com
2. Create new Web Service
3. Connect GitHub repository
4. Add environment variables
5. Deploy!

### Database (MongoDB Atlas)
1. Create cluster at mongodb.com
2. Add whitelist IP
3. Create user credentials
4. Get connection string
5. Add to MONGO_URI

---

## 📖 API Documentation

### Register User
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phone": "9876543210"
}
```

### Login
```
POST /api/v1/auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Get Restaurants
```
GET /api/v1/restaurants
GET /api/v1/restaurants?cuisine=Italian&rating=4
```

### Create Order
```
POST /api/v1/orders
{
  "orderItems": [
    {
      "foodItem": "item_id",
      "quantity": 2,
      "price": 299
    }
  ],
  "deliveryInfo": {
    "address": "123 Main St",
    "city": "Mumbai",
    "phoneNo": "9876543210"
  }
}
```

---

## 🧹 Code Quality

### Linting
```bash
cd frontend
npm run lint
```

### Formatting
```bash
# Backend
npx prettier --write .

# Frontend
npm run lint:fix
```

---

## 🤝 Need Help?

1. Check the detailed README: `README_COMPLETE.md`
2. Review API endpoints documentation
3. Check example API calls in `/backend/seed.js`
4. View component usage in `/frontend/src/pages`

---

## 📋 Next Steps

1. ✅ Setup completed
2. 📝 Explore the codebase
3. 🎨 Customize design system
4. 🔧 Add new features
5. 🚀 Deploy to production

---

**Happy Coding! 🎉**
