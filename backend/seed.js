const path = require('path');
const Restaurant = require('./models/restaurant');
const Menu = require('./models/menu');
const FoodItem = require('./models/foodItem');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDatabase = require('./config/db');

dotenv.config({ path: path.join(__dirname, '.env') });

const restaurants = [
    {
        name: "Spice Garden",
        description: "Authentic Indian cuisine with a modern twist.",
        location: "Mumbai, India",
        rating: 4.5,
        cuisine: "Indian",
        images: [
            { public_id: "res1-1", url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4" },
            { public_id: "res1-2", url: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8" },
            { public_id: "res1-3", url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398" }
        ]
    },
    {
        name: "Sushi World",
        description: "Fresh and delicious sushi and Japanese dishes.",
        location: "Delhi, India",
        rating: 4.2,
        cuisine: "Japanese",
        images: [
            { public_id: "res2-1", url: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b" },
            { public_id: "res2-2", url: "https://images.unsplash.com/photo-1553621042-f6e147245754" },
            { public_id: "res2-3", url: "https://images.unsplash.com/photo-1529042410759-befb1204b468" }
        ]
    },
    {
        name: "Bella Italia",
        description: "Traditional Italian pasta and wood-fired pizzas.",
        location: "Bangalore, India",
        rating: 4.7,
        cuisine: "Italian",
        images: [
            { public_id: "res3-1", url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4" },
            { public_id: "res3-2", url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002" },
            { public_id: "res3-3", url: "https://images.unsplash.com/photo-1612874742237-6526221588e3" }
        ]
    },
    {
        name: "Dragon Wok",
        description: "Authentic Chinese cuisine with bold flavors.",
        location: "Chennai, India",
        rating: 4.3,
        cuisine: "Chinese",
        images: [
            { public_id: "res4-1", url: "https://images.unsplash.com/photo-1552566626-52f8b828add9" },
            { public_id: "res4-2", url: "https://images.unsplash.com/photo-1525755662778-989d0524087e" },
            { public_id: "res4-3", url: "https://images.unsplash.com/photo-1603133872878-684f208fb84b" }
        ]
    },
    {
        name: "Taco Fiesta",
        description: "Mexican street food and festive atmosphere.",
        location: "Hyderabad, India",
        rating: 4.4,
        cuisine: "Mexican",
        images: [
            { public_id: "res5-1", url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47" },
            { public_id: "res5-2", url: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b" },
            { public_id: "res5-3", url: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f" }
        ]
    },
    {
        name: "Le Petit Bistro",
        description: "French cuisine with elegant presentation.",
        location: "Pune, India",
        rating: 4.6,
        cuisine: "French",
        images: [
            { public_id: "res6-1", url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0" },
            { public_id: "res6-2", url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a" },
            { public_id: "res6-3", url: "https://images.unsplash.com/photo-1600891964092-4316c288032e" }
        ]
    },
    {
        name: "Seoul Kitchen",
        description: "Korean BBQ and traditional Korean dishes.",
        location: "Mumbai, India",
        rating: 4.5,
        cuisine: "Korean",
        images: [
            { public_id: "res7-1", url: "https://images.unsplash.com/photo-1590301157890-4810ed352733" },
            { public_id: "res7-2", url: "https://images.unsplash.com/photo-1553163147-622ab57be1c7" },
            { public_id: "res7-3", url: "https://images.unsplash.com/photo-1536696593611-23d8c957fb9b" }
        ]
    },
    {
        name: "Mediterranean Grill",
        description: "Healthy Mediterranean flavors and fresh ingredients.",
        location: "Delhi, India",
        rating: 4.4,
        cuisine: "Mediterranean",
        images: [
            { public_id: "res8-1", url: "https://images.unsplash.com/photo-1544025162-d76690b67f37" },
            { public_id: "res8-2", url: "https://images.unsplash.com/photo-1577805947697-89e18249d767" },
            { public_id: "res8-3", url: "https://images.unsplash.com/photo-1546793665-c74683f339c1" }
        ]
    }
];

const seedData = async () => {
    try {
        await connectDatabase();
        
        await Restaurant.deleteMany();
        await Menu.deleteMany();
        await FoodItem.deleteMany();

        const createdRestaurants = await Restaurant.insertMany(restaurants);

        const foodItemsByCuisine = {
            'Indian': [
                { name: 'Paneer Tikka', price: 250, description: 'Char-grilled paneer with smoky spices and mint chutney', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8' },
                { name: 'Butter Chicken', price: 280, description: 'Creamy tomato curry with tender chicken and basmati rice', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398' },
                { name: 'Biryani', price: 320, description: 'Aromatic rice dish with spiced meat and fragrant herbs', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8' }
            ],
            'Japanese': [
                { name: 'Salmon Roll', price: 450, description: 'Fresh salmon, cucumber, and tangy mayo wrapped in seaweed', image: 'https://images.unsplash.com/photo-1553621042-f6e147245754' },
                { name: 'Chicken Teriyaki', price: 380, description: 'Grilled chicken glazed with sweet teriyaki sauce', image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468' },
                { name: 'Miso Soup', price: 120, description: 'Traditional Japanese soup with tofu and seaweed', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd' }
            ],
            'Italian': [
                { name: 'Margherita Pizza', price: 350, description: 'Classic pizza with fresh tomatoes, mozzarella, and basil', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002' },
                { name: 'Pasta Carbonara', price: 320, description: 'Creamy pasta with bacon, eggs, and parmesan cheese', image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3' },
                { name: 'Tiramisu', price: 180, description: 'Classic Italian dessert with coffee-soaked ladyfingers', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9' }
            ],
            'Chinese': [
                { name: 'Kung Pao Chicken', price: 290, description: 'Spicy stir-fried chicken with peanuts and vegetables', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e' },
                { name: 'Fried Rice', price: 200, description: 'Wok-fried rice with vegetables and choice of protein', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b' },
                { name: 'Spring Rolls', price: 150, description: 'Crispy rolls filled with vegetables and served with sweet chili sauce', image: 'https://images.unsplash.com/photo-1606335192038-f5a05f1e06c8' }
            ],
            'Mexican': [
                { name: 'Tacos al Pastor', price: 220, description: 'Marinated pork tacos with pineapple and fresh cilantro', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b' },
                { name: 'Burrito Bowl', price: 280, description: 'Rice bowl with beans, meat, guacamole, and salsa', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f' },
                { name: 'Churros', price: 120, description: 'Fried dough sticks with cinnamon sugar and chocolate sauce', image: 'https://images.unsplash.com/photo-1624371414361-e670edf4898c' }
            ],
            'French': [
                { name: 'Croissant', price: 80, description: 'Buttery, flaky pastry perfect for breakfast', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a' },
                { name: 'French Onion Soup', price: 180, description: 'Rich onion soup with melted gruyere cheese', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd' },
                { name: 'Coq au Vin', price: 380, description: 'Chicken braised in red wine with mushrooms', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e' }
            ],
            'Korean': [
                { name: 'Bibimbap', price: 320, description: 'Rice bowl with vegetables, meat, and gochujang sauce', image: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7' },
                { name: 'Korean BBQ', price: 450, description: 'Grilled meat served with various side dishes', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733' },
                { name: 'Kimchi', price: 100, description: 'Fermented vegetables with spicy seasoning', image: 'https://images.unsplash.com/photo-1536696593611-23d8c957fb9b' }
            ],
            'Mediterranean': [
                { name: 'Hummus Plate', price: 180, description: 'Creamy hummus with pita bread and olive oil', image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767' },
                { name: 'Falafel Wrap', price: 220, description: 'Crispy falafel balls in pita with tahini sauce', image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1' },
                { name: 'Greek Salad', price: 200, description: 'Fresh vegetables with feta cheese and olive oil dressing', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe' }
            ]
        };

        for (const restaurant of createdRestaurants) {
            const menu = await Menu.create({
                name: 'Main Menu',
                category: 'Lunch/Dinner',
                restaurant: restaurant._id
            });

            const items = foodItemsByCuisine[restaurant.cuisine] || foodItemsByCuisine['Indian'];
            
            for (const item of items) {
                await FoodItem.create({
                    name: item.name,
                    price: item.price,
                    description: item.description,
                    stock: 50,
                    images: [{ public_id: `${restaurant.name.toLowerCase().replace(/\s+/g, '-')}-${item.name.toLowerCase().replace(/\s+/g, '-')}`, url: item.image }],
                    menu: menu._id,
                    restaurant: restaurant._id
                });
            }
        }

        console.log('Data Seeded Successfully');
        process.exit();
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};

seedData();
