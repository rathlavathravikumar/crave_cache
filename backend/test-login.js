const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/user');

dotenv.config({ path: path.join(__dirname, '.env') });

const testLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');
        
        // Check if demo user exists
        const user = await User.findOne({ email: 'demo@example.com' }).select('+password');
        if (user) {
            console.log('✅ Demo user found:', user.email);
            console.log('User ID:', user._id);
            console.log('User name:', user.name);
        } else {
            console.log('❌ Demo user not found');
            
            // Create demo user
            const newUser = await User.create({
                name: 'Demo User',
                email: 'demo@example.com',
                password: 'demo123',
                phone: '1234567890',
                role: 'user'
            });
            console.log('✅ Demo user created:', newUser.email);
        }
        
        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

testLogin();
