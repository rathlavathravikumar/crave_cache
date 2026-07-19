const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const errorMiddleware = require('./middlewares/error');
const { apiLimiter, authLimiter, aiLimiter, paymentLimiter } = require('./middlewares/rateLimiter');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

app.use(helmet());

// Stripe webhook needs raw body - must be before express.json()
app.post('/api/v1/payment/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
    // Keep the raw body for Stripe signature verification
    req.rawBody = req.body;
    next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS policy: origin ${origin} is not allowed`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
    console.log('REQ', req.method, req.originalUrl);
    if (req.method !== 'GET') {
        console.log('Body:', JSON.stringify(req.body).substring(0, 200));
    }
    next();
});

app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);
app.use('/api/v1/payment/process', paymentLimiter);
app.use('/api/v1/ai', aiLimiter);
app.use('/api/v1/', apiLimiter);

const auth = require('./routes/auth');
const restaurant = require('./routes/restaurant');
const menu = require('./routes/menu');
const foodItem = require('./routes/foodItem');
const cart = require('./routes/cart');
const order = require('./routes/order');
const ai = require('./routes/ai');
const payment = require('./routes/payment');
const review = require('./routes/review');
const coupon = require('./routes/coupon');
const notification = require('./routes/notification');
const admin = require('./routes/admin');

app.get('/', (req, res) => res.json({ success: true, message: 'Food Genie API is running', version: '1.0.0', health: '/api/v1/health' }));
app.get('/api/v1/health', (req, res) => res.json({ success: true, message: 'Food Genie API is running', timestamp: new Date().toISOString() }));
app.get('/api/v1/_ping', (req, res) => res.json({ success: true, ping: 'pong', timestamp: Date.now() }));

app.use('/api/v1/auth', auth);
app.use('/api/v1/restaurants', restaurant);
app.use('/api/v1/menu', menu);
app.use('/api/v1/fooditems', foodItem);
app.use('/api/v1/cart', cart);
app.use('/api/v1/orders', order);
app.use('/api/v1/ai', ai);
app.use('/api/v1/payment', payment);
app.use('/api/v1/reviews', review);
app.use('/api/v1/coupons', coupon);
app.use('/api/v1/notifications', notification);
app.use('/api/v1/admin', admin);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
    });
});

app.use(errorMiddleware);

module.exports = app;