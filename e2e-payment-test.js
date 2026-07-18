#!/usr/bin/env node

/**
 * CraveCache - Phase 3 End-to-End Payment Flow Tests
 * Tests the complete payment flow from cart to payment confirmation
 */

const BASE_URL = 'http://localhost:5000/api/v1';
const TEST_USER = {
  email: 'test@cravecache.local',
  password: 'Test@1234',
  name: 'Test User',
  phone: '9876543210',
};

let authToken = '';
let userId = '';
let restaurantId = '';
let foodItemId = '';
let orderId = '';

// ANSI Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Helper function for API calls
async function apiCall(method, endpoint, body = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    return {
      status: response.status,
      data,
      ok: response.ok,
    };
  } catch (error) {
    return {
      status: 0,
      error: error.message,
      ok: false,
    };
  }
}

// Test counter
let testsRun = 0;
let testsPass = 0;
let testsFail = 0;

function logTest(name, passed, details = '') {
  testsRun++;
  if (passed) {
    testsPass++;
    console.log(`${colors.green}✓ PASS${colors.reset} - ${name}`);
  } else {
    testsFail++;
    console.log(`${colors.red}✗ FAIL${colors.reset} - ${name}`);
    if (details) {
      console.log(`  ${colors.yellow}→ ${details}${colors.reset}`);
    }
  }
}

function logSection(title) {
  console.log(`\n${colors.blue}═════ ${title} ═════${colors.reset}`);
}

// Test functions
async function testUserRegistration() {
  logSection('TEST 1: USER REGISTRATION');
  
  const response = await apiCall('POST', '/auth/register', {
    name: TEST_USER.name,
    email: TEST_USER.email,
    password: TEST_USER.password,
    phone: TEST_USER.phone,
  });

  logTest('User registration', response.ok && response.status === 201, 
    `Status: ${response.status}, Message: ${response.data?.message || response.data?.error}`);

  if (response.ok && response.data?.user) {
    userId = response.data.user._id;
    authToken = response.data?.token || '';
  }

  return response.ok;
}

async function testUserLogin() {
  logSection('TEST 2: USER LOGIN');
  
  const response = await apiCall('POST', '/auth/login', {
    email: TEST_USER.email,
    password: TEST_USER.password,
  });

  logTest('User login', response.ok && response.status === 200,
    `Status: ${response.status}`);

  if (response.ok && response.data?.token) {
    authToken = response.data.token;
  }

  return response.ok;
}

async function testGetRestaurants() {
  logSection('TEST 3: GET RESTAURANTS');
  
  const response = await apiCall('GET', '/restaurants');

  logTest('Get all restaurants', response.ok && response.status === 200,
    `Status: ${response.status}, Count: ${response.data?.restaurants?.length || 0}`);

  if (response.ok && response.data?.restaurants?.length > 0) {
    restaurantId = response.data.restaurants[0]._id;
  }

  return response.ok;
}

async function testGetFoodItems() {
  logSection('TEST 4: GET FOOD ITEMS');
  
  const response = await apiCall('GET', '/fooditems');

  logTest('Get all food items', response.ok && response.status === 200,
    `Status: ${response.status}, Count: ${response.data?.foodItems?.length || 0}`);

  if (response.ok && response.data?.foodItems?.length > 0) {
    foodItemId = response.data.foodItems[0]._id;
  }

  return response.ok;
}

async function testAddToCart() {
  logSection('TEST 5: ADD ITEM TO CART');
  
  const response = await apiCall('POST', '/cart', {
    foodItem: foodItemId,
    quantity: 2,
    restaurant: restaurantId,
  }, authToken);

  logTest('Add item to cart', response.ok && response.status === 200,
    `Status: ${response.status}`);

  return response.ok;
}

async function testGetUserCart() {
  logSection('TEST 6: GET USER CART');
  
  const response = await apiCall('GET', '/cart', null, authToken);

  logTest('Get user cart', response.ok && response.status === 200,
    `Status: ${response.status}, Items: ${response.data?.cart?.items?.length || 0}`);

  return response.ok;
}

async function testCreateOrder() {
  logSection('TEST 7: CREATE ORDER');
  
  const orderData = {
    orderItems: [
      {
        foodItem: foodItemId,
        name: 'Test Food Item',
        price: 299,
        quantity: 2,
        image: '',
      },
    ],
    deliveryInfo: {
      address: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      phoneNo: TEST_USER.phone,
      postalCode: '123456',
      country: 'India',
    },
    itemsPrice: 598,
    taxPrice: 108,
    deliveryPrice: 50,
    discountAmount: 0,
    totalPrice: 756,
    paymentInfo: {
      status: 'pending',
    },
  };

  const response = await apiCall('POST', '/orders/new', orderData, authToken);

  logTest('Create order', response.ok && response.status === 200,
    `Status: ${response.status}`);

  if (response.ok && response.data?.order?._id) {
    orderId = response.data.order._id;
    console.log(`  ${colors.cyan}→ Order ID: ${orderId}${colors.reset}`);
  }

  return response.ok;
}

async function testGetOrderDetails() {
  logSection('TEST 8: GET ORDER DETAILS');
  
  const response = await apiCall('GET', `/orders/${orderId}`, null, authToken);

  logTest('Get order details', response.ok && response.status === 200,
    `Status: ${response.status}, Total: ₹${response.data?.order?.totalPrice}`);

  return response.ok;
}

async function testGetUserOrders() {
  logSection('TEST 9: GET USER ORDERS');
  
  const response = await apiCall('GET', '/orders/me', null, authToken);

  logTest('Get user orders', response.ok && response.status === 200,
    `Status: ${response.status}, Orders: ${response.data?.orders?.length || 0}`);

  return response.ok;
}

async function testUpdateOrderStatus() {
  logSection('TEST 10: UPDATE ORDER STATUS');
  
  const response = await apiCall('PUT', `/orders/${orderId}/status`, 
    { status: 'Confirmed' }, authToken);

  logTest('Update order status', response.ok && response.status === 200,
    `Status: ${response.status}`);

  return response.ok;
}

async function testCancelOrder() {
  logSection('TEST 11: CANCEL ORDER');
  
  const response = await apiCall('PUT', `/orders/${orderId}/cancel`, {}, authToken);

  logTest('Cancel order', response.ok && response.status === 200,
    `Status: ${response.status}`);

  return response.ok;
}

async function testStripeCheckout() {
  logSection('TEST 12: CREATE STRIPE CHECKOUT SESSION');
  
  const paymentData = {
    items: [
      {
        foodItem: {
          _id: foodItemId,
          name: 'Test Food Item',
          price: 299,
          images: [{ url: 'https://via.placeholder.com/100' }],
        },
        quantity: 2,
      },
    ],
    restaurantId: restaurantId,
    orderId: orderId,
    totalAmount: 756,
  };

  const response = await apiCall('POST', '/payment/process', paymentData, authToken);

  logTest('Create Stripe checkout', response.ok && response.status === 200,
    `Status: ${response.status}, SessionID: ${response.data?.id ? 'Generated' : 'Failed'}`);

  if (response.ok && response.data?.url) {
    console.log(`  ${colors.cyan}→ Stripe URL: ${response.data.url}${colors.reset}`);
  }

  return response.ok;
}

async function testGetReviews() {
  logSection('TEST 13: GET REVIEWS BY RESTAURANT');
  
  const response = await apiCall('GET', `/reviews/restaurant/${restaurantId}`);

  logTest('Get restaurant reviews', response.ok && response.status === 200,
    `Status: ${response.status}, Reviews: ${response.data?.reviews?.length || 0}`);

  return response.ok;
}

async function testCreateReview() {
  logSection('TEST 14: CREATE REVIEW');
  
  const reviewData = {
    restaurantId: restaurantId,
    rating: 5,
    title: 'Excellent Service!',
    comment: 'Great food and fast delivery!',
  };

  const response = await apiCall('POST', '/reviews/new', reviewData, authToken);

  logTest('Create review', response.ok && response.status === 201,
    `Status: ${response.status}`);

  return response.ok;
}

async function testGetProfile() {
  logSection('TEST 15: GET USER PROFILE');
  
  const response = await apiCall('GET', '/auth/profile', null, authToken);

  logTest('Get user profile', response.ok && response.status === 200,
    `Status: ${response.status}, User: ${response.data?.user?.name}`);

  return response.ok;
}

async function testHealthCheck() {
  logSection('TEST 0: HEALTH CHECK');
  
  const response = await apiCall('GET', '/health');

  logTest('Backend health check', response.ok && response.status === 200,
    `Status: ${response.status}`);

  return response.ok;
}

// Main test runner
async function runAllTests() {
  console.log(`\n${colors.cyan}╔════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║  CraveCache Phase 3 - E2E Payment Tests   ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════╝${colors.reset}\n`);

  try {
    // Health check first
    const healthOk = await testHealthCheck();
    if (!healthOk) {
      console.log(`\n${colors.red}✗ Backend server is not running!${colors.reset}`);
      console.log(`${colors.yellow}Start backend: cd backend && npm run dev${colors.reset}`);
      process.exit(1);
    }

    // Run all tests
    await testUserRegistration();
    await testUserLogin();
    await testGetRestaurants();
    await testGetFoodItems();
    await testAddToCart();
    await testGetUserCart();
    await testCreateOrder();
    await testGetOrderDetails();
    await testGetUserOrders();
    await testUpdateOrderStatus();
    await testCancelOrder();
    await testStripeCheckout();
    await testGetReviews();
    await testCreateReview();
    await testGetProfile();

  } catch (error) {
    console.log(`\n${colors.red}✗ Test Error: ${error.message}${colors.reset}`);
  }

  // Print summary
  console.log(`\n${colors.cyan}═════ TEST SUMMARY ═════${colors.reset}`);
  console.log(`Total Tests: ${testsRun}`);
  console.log(`${colors.green}Passed: ${testsPass}${colors.reset}`);
  console.log(`${colors.red}Failed: ${testsFail}${colors.reset}`);

  const passPercentage = testsRun > 0 ? ((testsPass / testsRun) * 100).toFixed(1) : 0;
  console.log(`Pass Rate: ${colors.blue}${passPercentage}%${colors.reset}\n`);

  if (testsFail === 0) {
    console.log(`${colors.green}✓ ALL TESTS PASSED!${colors.reset}\n`);
  } else {
    console.log(`${colors.red}✗ SOME TESTS FAILED${colors.reset}\n`);
  }

  process.exit(testsFail === 0 ? 0 : 1);
}

// Run tests
runAllTests();
