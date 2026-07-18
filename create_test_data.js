const axios = require('axios');

const API_URL = 'http://localhost:5000/api/v1';

async function createTestUser() {
  try {
    console.log('Creating test user...');
    const response = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test User',
      email: 'test@example.com',
      password: 'test123',
      phone: '9876543210'
    });
    console.log('✅ Test user created successfully:', response.data.user);
    return response.data.user;
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
      console.log('ℹ️ Test user already exists');
      return { email: 'test@example.com', name: 'Test User' };
    }
    console.error('❌ Error creating test user:', error.response?.data || error.message);
    return null;
  }
}

async function createTestRestaurant() {
  try {
    console.log('Creating test restaurant...');
    const response = await axios.post(`${API_URL}/restaurants`, {
      name: 'Gourmet Kitchen',
      cuisine: 'Continental',
      location: 'Downtown',
      description: 'Fine dining experience with continental cuisine',
      rating: 4.8,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0'
        }
      ]
    });
    console.log('✅ Test restaurant created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error creating test restaurant:', error.response?.data || error.message);
    return null;
  }
}

async function testLogin() {
  try {
    console.log('Testing login with demo user...');
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'demo@example.com',
      password: 'demo123'
    });
    console.log('✅ Login successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    return null;
  }
}

async function fetchRestaurants() {
  try {
    console.log('Fetching restaurants...');
    const response = await axios.get(`${API_URL}/restaurants`);
    console.log(`✅ Found ${response.data.length} restaurants`);
    response.data.forEach((restaurant, index) => {
      console.log(`   ${index + 1}. ${restaurant.name} - ${restaurant.cuisine} (${restaurant.rating}⭐)`);
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching restaurants:', error.response?.data || error.message);
    return null;
  }
}

async function main() {
  console.log('=== CraveCache Test Data Creation ===\n');

  // Test login with existing demo user
  await testLogin();

  // Create new test user
  const testUser = await createTestUser();

  // Create test restaurant
  const testRestaurant = await createTestRestaurant();

  // Fetch all restaurants
  await fetchRestaurants();

  console.log('\n=== Test Complete ===');
  console.log('Test Accounts:');
  console.log('1. Demo User: demo@example.com / demo123');
  if (testUser) {
    console.log(`2. Test User: ${testUser.email} / test123`);
  }
}

main().catch(console.error);