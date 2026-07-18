const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/user');

dotenv.config({ path: path.join(__dirname, '.env') });

const testPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');
        
        const user = await User.findOne({ email: 'demo@example.com' }).select('+password');
        if (user) {
            console.log('✅ Demo user found:', user.email);
            console.log('Testing password comparison...');
            
            const isMatch = await user.comparePassword('demo123');
            console.log('Password match result:', isMatch);
            
            if (isMatch) {
                console.log('✅ Password is correct');
                const token = user.getJwtToken();
                console.log('JWT Token generated:', token.substring(0, 20) + '...');
            } else {
                console.log('❌ Password is incorrect');
            }
        } else {
            console.log('❌ Demo user not found');
        }
        
        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

testPassword();
