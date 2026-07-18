const axios = require('axios');

const API_URL = 'http://localhost:5000/api/v1';

// Test users
const testUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Test123!',
    phone: '9876543210'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'Test123!',
    phone: '9876543211'
  },
  {
    name: 'Mike Johnson',
    email: 'mike@example.com',
    password: 'Test123!',
    phone: '9876543212'
  }
];

// Test restaurants
const testRestaurants = [
  {
    name: 'Pizza Paradise',
    cuisine: 'Italian',
    location: 'New York',
    description: 'Authentic Italian pizza with fresh ingredients',
    rating: 4.7,
    images: [{ url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002' }]
  },
  {
    name: 'Sushi Express',
    cuisine: 'Japanese',
    location: 'Tokyo',
    description: 'Fresh sushi delivered fast',
    rating: 4.5,
    images: [{ url: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b' }]
  }
];

async function createUser(user) {
  try {
    console.log(`Creating user: ${user.email}...`);
    const response = await axios.post(`${API_URL}/auth/register`, user);
    console.log(`✅ User created: ${response.data.user.name}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
      console.log(`ℹ️ User ${user.email} already exists, attempting login...`);
      const loginResponse = await axios.post(`${API_URL}/auth/login`, {
        email: user.email,
        password: user.password
      });
      console.log(`✅ Logged in: ${loginResponse.data.user.name}`);
      return loginResponse.data;
    }
    console.error(`❌ Error creating user ${user.email}:`, error.response?.data || error.message);
    return null;
  }
}

async function createRestaurant(restaurant, token) {
  try {
    console.log(`Creating restaurant: ${restaurant.name}...`);
    const response = await axios.post(`${API_URL}/restaurants/admin/new`, restaurant, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Restaurant created: ${response.data.restaurant.name}`);
    return response.data.restaurant;
  } catch (error) {
    console.error(`❌ Error creating restaurant:`, error.response?.data || error.message);
    return null;
  }
}

async function getRestaurants() {
  try {
    console.log('Fetching restaurants...');
    const response = await axios.get(`${API_URL}/restaurants`);
    console.log(`✅ Found ${response.data.restaurants.length} restaurants`);
    response.data.restaurants.forEach((r, i) => {
      console.log(`   ${i + 1}. ${r.name} - ${r.cuisine} (${r.rating}⭐)`);
    });
    return response.data.restaurants;
  } catch (error) {
    console.error('❌ Error fetching restaurants:', error.response?.data || error.message);
    return [];
  }
}

async function getFoodItems() {
  try {
    console.log('Fetching food items...');
    const response = await axios.get(`${API_URL}/fooditems`);
    console.log(`✅ Found ${response.data.foodItems.length} food items`);
    response.data.foodItems.slice(0, 5).forEach((f, i) => {
      console.log(`   ${i + 1}. ${f.name} - ₹${f.price}`);
    });
    return response.data.foodItems;
  } catch (error) {
    console.error('❌ Error fetching food items:', error.response?.data || error.message);
    return [];
  }
}

async function addToCart(foodItem, restaurantId, token) {
  try {
    console.log(`Adding ${foodItem.name} to cart...`);
    const response = await axios.post(`${API_URL}/cart/add`, {
      foodItem: foodItem._id,
      restaurantId,
      quantity: 2
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Added to cart`);
    return response.data;
  } catch (error) {
    console.error('❌ Error adding to cart:', error.response?.data || error.message);
    return null;
  }
}

async function getCart(token) {
  try {
    console.log('Fetching cart...');
    const response = await axios.get(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Cart has ${response.data.items.length} items`);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching cart:', error.response?.data || error.message);
    return null;
  }
}

async function createOrder(token) {
  try {
    console.log('Creating order...');
    const response = await axios.post(`${API_URL}/orders/create`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Order created: ${response.data.order._id}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error creating order:', error.response?.data || error.message);
    return null;
  }
}

async function main() {
  console.log('=== CraveCache Full Functionality Test ===\n');

  // Test 1: Create users
  console.log('\n--- Testing User Creation ---');
  const users = [];
  for (const user of testUsers) {
    const userData = await createUser(user);
    if (userData) {
      users.push(userData);
    }
  }

  if (users.length === 0) {
    console.log('❌ No users created, cannot proceed with further tests');
    return;
  }

  const mainUser = users[0];
  console.log(`\nMain user for testing: ${mainUser.user.name} (${mainUser.user.email})`);

  // Test 2: Fetch restaurants
  console.log('\n--- Testing Restaurant Fetch ---');
  const restaurants = await getRestaurants();

  // Test 3: Fetch food items
  console.log('\n--- Testing Food Items Fetch ---');
  const foodItems = await getFoodItems();

  if (foodItems.length === 0) {
    console.log('❌ No food items available, cannot test cart functionality');
    return;
  }

  // Test 4: Add to cart
  console.log('\n--- Testing Cart Functionality ---');
  const firstFoodItem = foodItems[0];
  const firstRestaurant = restaurants[0] || { _id: 'restaurant-1' };
  
  await addToCart(firstFoodItem, firstRestaurant._id, mainUser.token);

  // Test 5: Get cart
  console.log('\n--- Testing Cart Fetch ---');
  const cart = await getCart(mainUser.token);

  // Test 6: Create order
  if (cart && cart.items.length > 0) {
    console.log('\n--- Testing Order Creation ---');
    await createOrder(mainUser.token);
  }

  console.log('\n=== Test Complete ===');
  console.log('\nTest Accounts Created:');
  users.forEach((u, i) => {
    console.log(`${i + 1}. ${u.user.name} - ${u.user.email} / Test123!`);
  });
}

main().catch(console.error);