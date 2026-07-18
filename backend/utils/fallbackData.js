const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const fallbackRestaurants = [
  {
    _id: 'restaurant-1',
    name: 'Spice Garden',
    description: 'Comforting Indian favorites with a modern twist.',
    location: 'Mumbai, India',
    rating: 4.8,
    cuisine: 'Indian',
    images: [{ public_id: 'res1', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4' }]
  },
  {
    _id: 'restaurant-2',
    name: 'Sushi World',
    description: 'Fresh sushi and Japanese classics.',
    location: 'Delhi, India',
    rating: 4.6,
    cuisine: 'Japanese',
    images: [{ public_id: 'res2', url: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b' }]
  },
  {
    _id: 'restaurant-3',
    name: 'Bella Italia',
    description: 'Traditional Italian pasta and wood-fired pizzas.',
    location: 'Bangalore, India',
    rating: 4.7,
    cuisine: 'Italian',
    images: [{ public_id: 'res3', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4' }]
  },
  {
    _id: 'restaurant-4',
    name: 'Dragon Wok',
    description: 'Authentic Chinese cuisine with bold flavors.',
    location: 'Chennai, India',
    rating: 4.3,
    cuisine: 'Chinese',
    images: [{ public_id: 'res4', url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9' }]
  },
  {
    _id: 'restaurant-5',
    name: 'Taco Fiesta',
    description: 'Mexican street food and festive atmosphere.',
    location: 'Hyderabad, India',
    rating: 4.4,
    cuisine: 'Mexican',
    images: [{ public_id: 'res5', url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47' }]
  },
  {
    _id: 'restaurant-6',
    name: 'Le Petit Bistro',
    description: 'French cuisine with elegant presentation.',
    location: 'Pune, India',
    rating: 4.6,
    cuisine: 'French',
    images: [{ public_id: 'res6', url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0' }]
  },
  {
    _id: 'restaurant-7',
    name: 'Seoul Kitchen',
    description: 'Korean BBQ and traditional Korean dishes.',
    location: 'Mumbai, India',
    rating: 4.5,
    cuisine: 'Korean',
    images: [{ public_id: 'res7', url: 'https://images.unsplash.com/photo-1590301157890-4810ed352733' }]
  },
  {
    _id: 'restaurant-8',
    name: 'Mediterranean Grill',
    description: 'Healthy Mediterranean flavors and fresh ingredients.',
    location: 'Delhi, India',
    rating: 4.4,
    cuisine: 'Mediterranean',
    images: [{ public_id: 'res8', url: 'https://images.unsplash.com/photo-1544025162-d76690b67f37' }]
  }
];

const fallbackFoodItems = [
  {
    _id: 'food-1',
    name: 'Paneer Tikka',
    price: 220,
    description: 'Char-grilled paneer with smoky spices and mint chutney.',
    stock: 24,
    images: [{ public_id: 'food1', url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8' }],
    menu: 'menu-1',
    restaurant: 'restaurant-1'
  },
  {
    _id: 'food-2',
    name: 'Butter Chicken',
    price: 280,
    description: 'Creamy tomato curry with tender chicken and fluffy basmati rice.',
    stock: 18,
    images: [{ public_id: 'food2', url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398' }],
    menu: 'menu-1',
    restaurant: 'restaurant-1'
  },
  {
    _id: 'food-3',
    name: 'Biryani',
    price: 320,
    description: 'Aromatic rice dish with spiced meat and fragrant herbs.',
    stock: 20,
    images: [{ public_id: 'food3', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8' }],
    menu: 'menu-1',
    restaurant: 'restaurant-1'
  },
  {
    _id: 'food-4',
    name: 'Salmon Roll',
    price: 360,
    description: 'Fresh salmon, cucumber, and tangy mayo wrapped in seaweed.',
    stock: 15,
    images: [{ public_id: 'food4', url: 'https://images.unsplash.com/photo-1553621042-f6e147245754' }],
    menu: 'menu-2',
    restaurant: 'restaurant-2'
  },
  {
    _id: 'food-5',
    name: 'Chicken Teriyaki',
    price: 380,
    description: 'Grilled chicken glazed with sweet teriyaki sauce.',
    stock: 12,
    images: [{ public_id: 'food5', url: 'https://images.unsplash.com/photo-1529042410759-befb1204b468' }],
    menu: 'menu-2',
    restaurant: 'restaurant-2'
  },
  {
    _id: 'food-6',
    name: 'Miso Soup',
    price: 120,
    description: 'Traditional Japanese soup with tofu and seaweed.',
    stock: 30,
    images: [{ public_id: 'food6', url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd' }],
    menu: 'menu-2',
    restaurant: 'restaurant-2'
  },
  {
    _id: 'food-7',
    name: 'Margherita Pizza',
    price: 350,
    description: 'Classic pizza with fresh tomatoes, mozzarella, and basil.',
    stock: 16,
    images: [{ public_id: 'food7', url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002' }],
    menu: 'menu-3',
    restaurant: 'restaurant-3'
  },
  {
    _id: 'food-8',
    name: 'Pasta Carbonara',
    price: 320,
    description: 'Creamy pasta with bacon, eggs, and parmesan cheese.',
    stock: 14,
    images: [{ public_id: 'food8', url: 'https://images.unsplash.com/photo-1612874742237-6526221588e3' }],
    menu: 'menu-3',
    restaurant: 'restaurant-3'
  },
  {
    _id: 'food-9',
    name: 'Tiramisu',
    price: 180,
    description: 'Classic Italian dessert with coffee-soaked ladyfingers.',
    stock: 22,
    images: [{ public_id: 'food9', url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9' }],
    menu: 'menu-3',
    restaurant: 'restaurant-3'
  },
  {
    _id: 'food-10',
    name: 'Kung Pao Chicken',
    price: 290,
    description: 'Spicy stir-fried chicken with peanuts and vegetables.',
    stock: 18,
    images: [{ public_id: 'food10', url: 'https://images.unsplash.com/photo-1525755662778-989d0524087e' }],
    menu: 'menu-4',
    restaurant: 'restaurant-4'
  },
  {
    _id: 'food-11',
    name: 'Fried Rice',
    price: 200,
    description: 'Wok-fried rice with vegetables and choice of protein.',
    stock: 25,
    images: [{ public_id: 'food11', url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b' }],
    menu: 'menu-4',
    restaurant: 'restaurant-4'
  },
  {
    _id: 'food-12',
    name: 'Spring Rolls',
    price: 150,
    description: 'Crispy rolls filled with vegetables and served with sweet chili sauce.',
    stock: 28,
    images: [{ public_id: 'food12', url: 'https://images.unsplash.com/photo-1606335192038-f5a05f1e06c8' }],
    menu: 'menu-4',
    restaurant: 'restaurant-4'
  },
  {
    _id: 'food-13',
    name: 'Tacos al Pastor',
    price: 220,
    description: 'Marinated pork tacos with pineapple and fresh cilantro.',
    stock: 20,
    images: [{ public_id: 'food13', url: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b' }],
    menu: 'menu-5',
    restaurant: 'restaurant-5'
  },
  {
    _id: 'food-14',
    name: 'Burrito Bowl',
    price: 280,
    description: 'Rice bowl with beans, meat, guacamole, and salsa.',
    stock: 16,
    images: [{ public_id: 'food14', url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f' }],
    menu: 'menu-5',
    restaurant: 'restaurant-5'
  },
  {
    _id: 'food-15',
    name: 'Churros',
    price: 120,
    description: 'Fried dough sticks with cinnamon sugar and chocolate sauce.',
    stock: 24,
    images: [{ public_id: 'food15', url: 'https://images.unsplash.com/photo-1624371414361-e670edf4898c' }],
    menu: 'menu-5',
    restaurant: 'restaurant-5'
  },
  {
    _id: 'food-16',
    name: 'Croissant',
    price: 80,
    description: 'Buttery, flaky pastry perfect for breakfast.',
    stock: 30,
    images: [{ public_id: 'food16', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a' }],
    menu: 'menu-6',
    restaurant: 'restaurant-6'
  },
  {
    _id: 'food-17',
    name: 'French Onion Soup',
    price: 180,
    description: 'Rich onion soup with melted gruyere cheese.',
    stock: 18,
    images: [{ public_id: 'food17', url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd' }],
    menu: 'menu-6',
    restaurant: 'restaurant-6'
  },
  {
    _id: 'food-18',
    name: 'Coq au Vin',
    price: 380,
    description: 'Chicken braised in red wine with mushrooms.',
    stock: 12,
    images: [{ public_id: 'food18', url: 'https://images.unsplash.com/photo-1600891964092-4316c288032e' }],
    menu: 'menu-6',
    restaurant: 'restaurant-6'
  },
  {
    _id: 'food-19',
    name: 'Bibimbap',
    price: 320,
    description: 'Rice bowl with vegetables, meat, and gochujang sauce.',
    stock: 15,
    images: [{ public_id: 'food19', url: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7' }],
    menu: 'menu-7',
    restaurant: 'restaurant-7'
  },
  {
    _id: 'food-20',
    name: 'Korean BBQ',
    price: 450,
    description: 'Grilled meat served with various side dishes.',
    stock: 10,
    images: [{ public_id: 'food20', url: 'https://images.unsplash.com/photo-1590301157890-4810ed352733' }],
    menu: 'menu-7',
    restaurant: 'restaurant-7'
  },
  {
    _id: 'food-21',
    name: 'Kimchi',
    price: 100,
    description: 'Fermented vegetables with spicy seasoning.',
    stock: 35,
    images: [{ public_id: 'food21', url: 'https://images.unsplash.com/photo-1536696593611-23d8c957fb9b' }],
    menu: 'menu-7',
    restaurant: 'restaurant-7'
  },
  {
    _id: 'food-22',
    name: 'Hummus Plate',
    price: 180,
    description: 'Creamy hummus with pita bread and olive oil.',
    stock: 22,
    images: [{ public_id: 'food22', url: 'https://images.unsplash.com/photo-1577805947697-89e18249d767' }],
    menu: 'menu-8',
    restaurant: 'restaurant-8'
  },
  {
    _id: 'food-23',
    name: 'Falafel Wrap',
    price: 220,
    description: 'Crispy falafel balls in pita with tahini sauce.',
    stock: 18,
    images: [{ public_id: 'food23', url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1' }],
    menu: 'menu-8',
    restaurant: 'restaurant-8'
  },
  {
    _id: 'food-24',
    name: 'Greek Salad',
    price: 200,
    description: 'Fresh vegetables with feta cheese and olive oil dressing.',
    stock: 20,
    images: [{ public_id: 'food24', url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe' }],
    menu: 'menu-8',
    restaurant: 'restaurant-8'
  }
];

const fallbackUsers = [];
const fallbackCarts = [];
const fallbackOrders = [];

const isDatabaseReady = () => mongoose.connection.readyState === 1;

const getFallbackUserByEmail = (email) => fallbackUsers.find((user) => user.email === email.toLowerCase());
const getFallbackUserById = (id) => fallbackUsers.find((user) => user._id === id);
const updateFallbackUser = (id, updates = {}) => {
  const user = getFallbackUserById(id);
  if (!user) return null;

  Object.assign(user, updates);
  return user;
};

const createFallbackToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

const addFallbackUser = async ({ name, email, password, phone, role = 'user' }) => {
  const existing = getFallbackUserByEmail(email);
  if (existing) return existing;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    _id: `user-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    password: passwordHash,
    phone,
    role,
    avatar: { url: 'https://res.cloudinary.com/demo/image/upload/v1622543328/sample.jpg' }
  };
  fallbackUsers.push(user);
  return user;
};

const compareFallbackPassword = async (password, hash) => bcrypt.compare(password, hash);

module.exports = {
  fallbackRestaurants,
  fallbackFoodItems,
  fallbackUsers,
  fallbackCarts,
  fallbackOrders,
  isDatabaseReady,
  getFallbackUserByEmail,
  getFallbackUserById,
  updateFallbackUser,
  createFallbackToken,
  addFallbackUser,
  compareFallbackPassword
};
