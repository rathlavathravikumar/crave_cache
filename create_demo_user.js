const axios = require('axios');

async function testRestaurants() {
  try {
    const response = await axios.get('http://localhost:5000/api/v1/restaurants');
    
    console.log('Restaurants fetched successfully!');
    console.log('Total restaurants:', response.data.count);
    console.log('Restaurants:');
    response.data.restaurants.forEach(r => {
      console.log(`- ${r.name} (${r.cuisine}) - Rating: ${r.rating} - Location: ${r.location}`);
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error.response?.data || error.message);
  }
}

testRestaurants();