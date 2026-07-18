const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/user');

dotenv.config({ path: path.join(__dirname, '.env') });

const connectDatabase = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error("MONGO_URI is not defined in .env");
        }
        console.log("Attempting MongoDB connection...");
        const con = await mongoose.connect(uri);
        console.log(`✅ MongoDB Connected: ${con.connection.host}`);
    } catch (err) {
        console.error("❌ MongoDB Connection Failed");
        console.error(err);
        process.exit(1);
    }
};

async function addUser() {
    await connectDatabase();

    try {
        const user = await User.create({
            name: 'Demo User 2',
            email: 'demo2@example.com',
            password: 'demo123',
            phone: '0987654321',
            role: 'user'
        });

        console.log('✅ User created successfully!');
        console.log('User details:', {
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        });
    } catch (error) {
        console.error('❌ Error creating user:', error.message);
        if (error.code === 11000) {
            console.error('User with this email already exists');
        }
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

addUser();
