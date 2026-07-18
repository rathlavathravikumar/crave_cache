const axios = require('axios');

async function seedViaAPI() {
    try {
        // We'll use the existing fallback data mechanism to trigger seeding
        // Since the server is already running with in-memory DB, we need to restart it with data
        
        console.log('To seed the database with restaurants, we need to:');
        console.log('1. Stop the current backend server');
        console.log('2. Run the seed script to populate the database');
        console.log('3. Restart the backend server');
        console.log('');
        console.log('The application already has fallback restaurant data configured.');
        console.log('The fallback data includes 8 restaurants with multiple food items each.');
        console.log('');
        console.log('Restaurants available in fallback data:');
        console.log('- Spice Garden (Indian)');
        console.log('- Sushi World (Japanese)');
        console.log('- Bella Italia (Italian)');
        console.log('- Dragon Wok (Chinese)');
        console.log('- Taco Fiesta (Mexican)');
        console.log('- Le Petit Bistro (French)');
        console.log('- Seoul Kitchen (Korean)');
        console.log('- Mediterranean Grill (Mediterranean)');
        console.log('');
        console.log('These fallback restaurants will be displayed when the database is empty.');
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

seedViaAPI();