# 🧪 PHASE 3 - E2E PAYMENT FLOW TESTING GUIDE

## Overview
This guide covers comprehensive end-to-end testing for the payment flow implemented in Phase 3.

---

## 📋 TEST CATEGORIES

### 1. **Backend API Tests** (15 tests)
- [ ] Health check
- [ ] User registration
- [ ] User login
- [ ] Get restaurants
- [ ] Get food items
- [ ] Add to cart
- [ ] Get user cart
- [ ] Create order
- [ ] Get order details
- [ ] Get user orders
- [ ] Update order status
- [ ] Cancel order
- [ ] Create Stripe checkout
- [ ] Get reviews
- [ ] Create review

### 2. **Frontend Integration Tests** (Manual)
- [ ] CartPage renders correctly
- [ ] Navigate to checkout route
- [ ] CheckoutPage displays order items
- [ ] Address selection works
- [ ] Coupon input appears
- [ ] Price calculation is correct
- [ ] "Proceed to Payment" button triggers order creation
- [ ] Stripe checkout opens
- [ ] After payment → redirect to success page
- [ ] PaymentSuccessPage shows order details
- [ ] Track order link works
- [ ] Order again button works

### 3. **Error Handling Tests**
- [ ] Missing required fields
- [ ] Invalid coupon code
- [ ] Order not found
- [ ] Unauthorized access (401)
- [ ] Admin-only endpoints (403)
- [ ] Payment processing errors
- [ ] Network errors

### 4. **State Management Tests**
- [ ] Redux cart slice updates
- [ ] Redux order slice updates
- [ ] Payment state changes
- [ ] Error state management

---

## 🚀 QUICK START

### Step 1: Start Backend Server
```bash
cd backend
npm install
npm run dev
```

Expected output:
```
Server running on port 5000
MongoDB connected successfully
✓ All routes registered
```

### Step 2: Run Automated E2E Tests
```bash
cd ..
node e2e-payment-test.js
```

This will:
1. ✓ Check backend health
2. ✓ Register test user
3. ✓ Login user
4. ✓ Get restaurants and food items
5. ✓ Add items to cart
6. ✓ Create order
7. ✓ Update order status
8. ✓ Create Stripe session
9. ✓ Test reviews system
10. ✓ Get user profile

### Step 3: Start Frontend Server (Optional - for manual UI testing)
```bash
cd frontend
npm install
npm run dev
```

Access: http://localhost:5173

---

## 🧬 DETAILED TEST SCENARIOS

### Scenario 1: Complete Payment Flow
**Goal:** Verify full user journey from cart to payment confirmation

**Steps:**
1. Register new user
2. Browse restaurants
3. Select restaurant
4. Add food items to cart
5. Navigate to /checkout
6. Review order summary
7. Verify address selection
8. Apply coupon (optional)
9. Click "Proceed to Payment"
10. Order created in database
11. Stripe session generated
12. User redirected to Stripe checkout
13. Complete test payment with Stripe test card
14. Stripe redirects to /payment-success
15. Order details displayed
16. User can track order

**Success Criteria:**
- Order saved with correct items and total
- Stripe session created with orderId in metadata
- Payment success page displays order
- Order status updated after webhook (if webhook configured)

---

### Scenario 2: Error Handling
**Goal:** Verify proper error messages and recovery

**Test Cases:**
```
1. Missing delivery address
   → Show error: "No delivery address found"
   
2. Empty cart
   → Show error: "Cart is empty"
   
3. Invalid coupon
   → Show error: "Invalid coupon code"
   
4. Network error during order creation
   → Show error message, cart remains
   
5. Payment cancelled on Stripe
   → Redirect to /payment-failure
   → Show "Payment was cancelled"
```

---

### Scenario 3: Order Management
**Goal:** Verify order lifecycle

**Test Cases:**
```
1. Create order → Status: "Pending"
2. Admin updates to "Confirmed" → Order.statusHistory added
3. Admin updates to "Preparing" → Timeline updated
4. Admin updates to "Ready" → Timeline updated
5. Admin updates to "Out for Delivery" → Timeline updated
6. Admin updates to "Delivered" → deliveredAt set
7. User views order → Timeline displayed
8. User can cancel if still Pending
9. Cannot cancel if Delivered
```

---

### Scenario 4: Redux State Management
**Goal:** Verify state updates correctly

**Test Cases:**
```
1. Initial state:
   - cart.items = []
   - orders.paymentInProgress = false
   - orders.paymentError = null

2. After add to cart:
   - cart.items = [item, item, ...]
   - cart.restaurantId set

3. During checkout:
   - orders.paymentInProgress = true

4. Payment success:
   - orders.paymentInProgress = false
   - orders.lastPaymentStatus = "success"
   - cart.items cleared

5. Payment error:
   - orders.paymentInProgress = false
   - orders.paymentError = "Error message"
   - cart.items preserved
```

---

## 🔐 STRIPE TEST CARDS

For testing Stripe payments:

| Card Type | Card Number | Exp | CVC |
|-----------|-------------|-----|-----|
| **Success** | 4242 4242 4242 4242 | Any future | Any 3 digits |
| **Declined** | 4000 0000 0000 0002 | Any future | Any 3 digits |
| **CVC Required** | 4000 0000 0000 0127 | Any future | Required (any 3) |

**Note:** All test cards use Stripe's test mode keys. No real charges.

---

## 📊 VERIFICATION CHECKLIST

### Backend
- [ ] All 15 API endpoints respond correctly
- [ ] Order created with correct data
- [ ] Payment metadata includes orderId
- [ ] Order status updates work
- [ ] Reviews can be created
- [ ] Error messages are descriptive
- [ ] Authentication tokens working
- [ ] CORS properly configured

### Frontend Routes
- [ ] `/checkout` - CheckoutPage loads
- [ ] `/payment-success` - PaymentSuccessPage loads
- [ ] `/payment-failure` - PaymentFailurePage loads
- [ ] Protected routes redirect unauthorized users
- [ ] Navbar links work

### Redux State
- [ ] Cart state updates on add/remove
- [ ] Order state updates on create
- [ ] Payment state changes during process
- [ ] Error states handled

### UI/UX
- [ ] Loading spinners show during processing
- [ ] Error messages display clearly
- [ ] Success page shows order details
- [ ] Responsive design on mobile
- [ ] All buttons are clickable
- [ ] Form validations work

---

## 📈 PERFORMANCE BENCHMARKS

| Metric | Target | Acceptable |
|--------|--------|-----------|
| Order Creation | < 200ms | < 500ms |
| Stripe Session | < 500ms | < 1s |
| Page Load (Checkout) | < 1s | < 2s |
| Page Load (Success) | < 1s | < 2s |
| Order Fetch | < 200ms | < 500ms |

---

## 🐛 KNOWN ISSUES & WORKAROUNDS

### Issue 1: Stripe Webhook Not Firing Locally
**Problem:** Webhooks only work with public URLs
**Workaround:** 
- Use ngrok to tunnel localhost: `ngrok http 5000`
- Update Stripe dashboard with ngrok URL
- Set `STRIPE_WEBHOOK_SECRET` in .env

### Issue 2: Images Not Loading
**Problem:** Image URLs invalid
**Workaround:** 
- Use placeholder URLs in tests
- Implement Cloudinary in Phase 4
- Check CORS configuration

### Issue 3: Coupon Validation Not Working
**Problem:** Endpoint not implemented yet (Phase 6)
**Workaround:**
- UI shows input but validation fails gracefully
- Proceed without coupon for now

---

## 📝 TEST RESULTS TEMPLATE

```
╔════════════════════════════════════════════╗
║  CraveCache Phase 3 - E2E Payment Tests   ║
╚════════════════════════════════════════════╝

✓ PASS - Health check
✓ PASS - User registration
✓ PASS - User login
✓ PASS - Get restaurants
✓ PASS - Get food items
✓ PASS - Add to cart
✓ PASS - Get user cart
✓ PASS - Create order
✓ PASS - Get order details
✓ PASS - Get user orders
✓ PASS - Update order status
✓ PASS - Cancel order
✓ PASS - Create Stripe session
✓ PASS - Get reviews
✓ PASS - Create review

═════ TEST SUMMARY ═════
Total Tests: 15
Passed: 15
Failed: 0
Pass Rate: 100%

✓ ALL TESTS PASSED!
```

---

## 🔍 DEBUGGING

### Check Backend Logs
```bash
# Look for errors in terminal running backend
npm run dev
```

### Check Network in Browser DevTools
```
1. Open Developer Tools (F12)
2. Go to Network tab
3. Track requests to:
   - POST /api/v1/orders/new
   - POST /api/v1/payment/process
   - GET /api/v1/orders/:id
```

### Check Redux DevTools
```
1. Install Redux DevTools browser extension
2. Open DevTools → Redux tab
3. Monitor state changes during payment flow
4. Check cart, orders, and payment states
```

### Check API Response
```javascript
// In browser console
fetch('http://localhost:5000/api/v1/orders/me', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
})
.then(r => r.json())
.then(d => console.log(d))
```

---

## ✅ SIGN-OFF CHECKLIST

After all tests pass:
- [ ] Backend E2E tests: 15/15 passed
- [ ] Frontend routes: All accessible
- [ ] Payment flow: Complete end-to-end
- [ ] Error handling: All edge cases covered
- [ ] Redux state: Correctly updated
- [ ] Stripe integration: Session creates successfully
- [ ] Order management: CRUD operations work
- [ ] UI/UX: Responsive and intuitive

---

## 📞 NEXT STEPS

After testing passes:
1. **Phase 4**: Cloudinary image upload
2. **Phase 5**: Admin dashboard
3. **Phase 6**: Advanced features (coupons, tracking, email)
4. **Phase 7**: Comprehensive testing
5. **Phase 8**: Production deployment

---

**Test File:** `e2e-payment-test.js`  
**Created:** 2026-07-18  
**Last Updated:** Phase 3 Completion
