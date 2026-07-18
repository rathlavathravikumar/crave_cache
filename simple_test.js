const axios = require('axios');

async function testServer() {
  try {
    console.log('Testing server health...');
    const response = await axios.get('http://localhost:5000/api/v1/_ping');
    console.log('✅ Server is reachable:', response.data);
  } catch (error) {
    console.error('❌ Server not reachable:', error.message);
  }

  try {
    console.log('\nTesting restaurants endpoint...');
    const response = await axios.get('http://localhost:5000/api/v1/restaurants');
    console.log('✅ Restaurants endpoint working:', response.data.restaurants.length, 'restaurants');
  } catch (error) {
    console.error('❌ Restaurants endpoint failed:', error.response?.data || error.message);
  }

  try {
    console.log('\nTesting food items endpoint...');
    const response = await axios.get('http://localhost:5000/api/v1/fooditems');
    console.log('✅ Food items endpoint working:', response.data.foodItems.length, 'items');
  } catch (error) {
    console.error('❌ Food items endpoint failed:', error.response?.data || error.message);
  }
}

testServer();