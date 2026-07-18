# CraveCache - Production Deployment Guide

## 🚀 Complete Deployment Instructions

### Prerequisites
- GitHub account
- Vercel account (Frontend)
- Render account (Backend)
- MongoDB Atlas account
- Stripe account

---

## 📋 STEP 1: Prepare Code for Production

### 1.1 Update Backend Configuration

**`backend/.env` (Production)**
```bash
MONGO_URI=mongodb+srv://produser:prodpass@cluster.mongodb.net/cravecache-prod
JWT_SECRET=generate_random_32_char_string_here
PORT=5000
NODE_ENV=production
STRIPE_API_KEY=sk_live_your_live_key_here
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GROQ_API_KEY=your_groq_key
FRONTEND_URL=https://cravecache.vercel.app
SMTP_SERVICE=gmail
SMTP_MAIL=noreply@cravecache.com
SMTP_PASSWORD=your_app_password
```

### 1.2 Update Frontend Configuration

**`frontend/.env.production`**
```bash
VITE_API_URL=https://cravecache-backend.onrender.com
VITE_API_BASE_PATH=/api/v1
VITE_STRIPE_PUBLIC_KEY=pk_live_your_live_key_here
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_ANALYTICS=true
```

### 1.3 Build Frontend

```bash
cd frontend
npm run build
# Creates optimized dist/ folder
```

---

## 🗄️ STEP 2: Setup MongoDB Atlas

### 2.1 Create Cluster
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free cluster (M0)
3. Select region close to your users
4. Name it "cravecache-prod"

### 2.2 Configure Network Access
1. Go to "Network Access"
2. Add IP Whitelist: `0.0.0.0/0` (or specific IP)
3. Or use "Allow Access from Anywhere"

### 2.3 Create Database User
1. Go to "Database Access"
2. Create user (e.g., `produser`)
3. Set strong password
4. Assign `readWriteAnyDatabase` role

### 2.4 Get Connection String
1. Go to "Databases"
2. Click "Connect"
3. Choose "Connect your application"
4. Copy connection string
5. Replace `<password>` with actual password

**Format:**
```
mongodb+srv://produser:password@cluster0.xxxxx.mongodb.net/cravecache-prod?retryWrites=true&w=majority
```

---

## 🔐 STEP 3: Configure Stripe

### 3.1 Get Live Keys
1. Go to [stripe.com/dashboard](https://stripe.com/dashboard)
2. Switch to "Live" mode
3. Copy Publishable Key (pk_live_...)
4. Copy Secret Key (sk_live_...)

### 3.2 Setup Webhooks
1. Go to "Webhooks"
2. Add endpoint: `https://cravecache-backend.onrender.com/api/v1/payment/webhook`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy signing secret

### 3.3 Test Payments
Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

---

## 🎨 STEP 4: Setup Cloudinary

### 4.1 Get Credentials
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up or login
3. Go to Dashboard
4. Copy:
   - Cloud Name
   - API Key
   - API Secret

### 4.2 Create Folders
1. Go to "Media Library"
2. Create folders:
   - `/cravecache/restaurants`
   - `/cravecache/fooditems`
   - `/cravecache/users`

---

## 🤖 STEP 5: Setup Groq API (Optional AI Features)

### 5.1 Get API Key
1. Go to [console.groq.com](https://console.groq.com)
2. Create account
3. Generate API key
4. Copy key (gsk_...)

### 5.2 Test API
```bash
curl -X POST https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "llama-3-8b-chat", "messages": [{"role": "user", "content": "Hi"}]}'
```

---

## 🌐 STEP 6: Deploy Backend (Render)

### 6.1 Create Web Service on Render
1. Go to [render.com](https://render.com)
2. Sign up (connect GitHub)
3. Click "New" → "Web Service"
4. Connect GitHub repository
5. Select `backend` folder
6. Configure:
   - **Name**: cravecache-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or Pro for SSL)

### 6.2 Add Environment Variables
1. Go to "Environment"
2. Add all variables from production `.env`
3. Click "Create Web Service"
4. Wait for deployment (5-10 min)
5. Copy service URL (e.g., https://cravecache-backend.onrender.com)

### 6.3 Verify Deployment
```bash
curl https://cravecache-backend.onrender.com/api/v1/health
# Should return: {"success": true, "message": "API running"}
```

---

## 🎯 STEP 7: Deploy Frontend (Vercel)

### 7.1 Push Code to GitHub
```bash
git add .
git commit -m "Ready for production"
git push origin main
```

### 7.2 Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up (connect GitHub)
3. Click "Import Project"
4. Select your repository
5. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 7.3 Add Environment Variables
1. Go to "Settings" → "Environment Variables"
2. Add variables:
   ```
   VITE_API_URL=https://cravecache-backend.onrender.com
   VITE_STRIPE_PUBLIC_KEY=pk_live_xxx
   ```
3. Click "Deploy"
4. Wait for deployment (2-5 min)

### 7.4 Custom Domain
1. Go to "Settings" → "Domains"
2. Add your domain (e.g., cravecache.com)
3. Follow DNS configuration
4. SSL auto-installed

---

## ✅ STEP 8: Post-Deployment Checklist

### 8.1 Test APIs
```bash
# Test health check
curl https://cravecache-backend.onrender.com/api/v1/health

# Test registration
curl -X POST https://cravecache-backend.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"Password123","phone":"9876543210"}'
```

### 8.2 Test Frontend
1. Visit https://cravecache.vercel.app
2. Check:
   - Page loads
   - Styling is correct
   - No console errors
   - API calls work

### 8.3 Test Payments
1. Go to Cart → Checkout
2. Test with Stripe test card
3. Verify payment success
4. Check order in database

### 8.4 Setup Monitoring
1. **Render**: Enable "Auto-Deploy on Push"
2. **Vercel**: Enable "Deploy on Every Push"
3. Set up alerts for failures

---

## 🔒 STEP 9: Security Hardening

### 9.1 Environment Secrets
- ✅ Never commit `.env` files
- ✅ Use production secrets only on servers
- ✅ Rotate secrets periodically
- ✅ Use different secrets for staging/prod

### 9.2 HTTPS & SSL
- ✅ Force HTTPS in frontend
- ✅ Set HSTS headers
- ✅ Use secure cookies (httpOnly, secure)

### 9.3 Rate Limiting
- ✅ Auth endpoints: 5 attempts per 15 min
- ✅ API endpoints: 100 requests per 15 min
- ✅ Payment: 10 attempts per hour

### 9.4 Data Protection
- ✅ Encrypt sensitive data
- ✅ Use MongoDB encryption
- ✅ Regular backups
- ✅ GDPR compliance

---

## 📊 STEP 10: Monitoring & Analytics

### 10.1 Backend Monitoring (Render)
1. Go to "Logs" in Render dashboard
2. Check for errors
3. Monitor CPU/Memory usage
4. Set up alerts

### 10.2 Frontend Monitoring (Vercel)
1. Go to "Deployments" in Vercel
2. Check build logs
3. Monitor performance
4. Check analytics

### 10.3 Database Monitoring
1. Go to MongoDB Atlas dashboard
2. Monitor collections size
3. Check query performance
4. Set up backup schedule

---

## 🚨 Troubleshooting

### Issue: Backend deployment fails
**Solution:**
1. Check build logs in Render
2. Verify all environment variables
3. Test locally first
4. Check database connection

### Issue: CORS errors
**Solution:**
1. Verify FRONTEND_URL in backend `.env`
2. Check corsOptions in `server.js`
3. Ensure frontend and backend URLs match

### Issue: Long loading times
**Solution:**
1. Enable caching in Vercel
2. Optimize database queries
3. Use CDN for images
4. Enable gzip compression

### Issue: Payment failures
**Solution:**
1. Verify Stripe keys are production keys
2. Check webhook configuration
3. Review Stripe logs
4. Test with test card

---

## 📈 Performance Optimization

### Frontend
```bash
# Enable caching
vercel env add NEXT_PUBLIC_APP_DEBUG=false

# Check bundle size
npm run build -- --analyze
```

### Backend
```bash
# Enable caching headers
# Use database indexes
# Implement API pagination
# Add response compression
```

### Database
```bash
# Create indexes on frequently queried fields
db.fooditems.createIndex({ "name": "text", "description": "text" })
db.orders.createIndex({ "user": 1, "createdAt": -1 })
```

---

## 🔄 Continuous Deployment

### GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: curl ${{ secrets.RENDER_DEPLOY_HOOK }}
```

---

## 📞 Support

- **Render Support**: [render.com/support](https://render.com/support)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **MongoDB Support**: [docs.mongodb.com](https://docs.mongodb.com)
- **Stripe Support**: [stripe.com/support](https://stripe.com/support)

---

## 🎉 Deployment Complete!

Your CraveCache application is now live in production!

**Verify:**
- ✅ Frontend: https://cravecache.vercel.app
- ✅ Backend: https://cravecache-backend.onrender.com
- ✅ Database: MongoDB Atlas (production)
- ✅ Payments: Stripe (live keys)
- ✅ Storage: Cloudinary (production)

---

**Congratulations on your successful deployment! 🎊**
