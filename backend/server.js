const connectDatabase = require('./config/db');
const app = require('./app');

process.on('uncaughtException', (err) => {
    console.log(`ERROR: ${err.stack}`);
    console.log('Shutting down due to uncaught exception');
    process.exit(1);
});

const dbSource = process.env.MONGO_URI ? 'MONGO_URI' : 'local MongoDB default';
console.log(`Server starting using DB source: ${dbSource}`);

const start = async () => {
    try {
        await connectDatabase();
        

        const server = app.listen(process.env.PORT || 5000, () => {
            console.log(`Server started on PORT: ${process.env.PORT || 5000} in ${process.env.NODE_ENV || 'development'} mode.`);
        });

        process.on('unhandledRejection', (err) => {
            console.log(`ERROR: ${err.stack}`);
            console.log('Shutting down the server due to Unhandled Promise rejection');
            server.close(() => {
                process.exit(1);
            });
        });
    } catch (err) {
        console.log('Failed to start server:', err);
        process.exit(1);
    }
};

start();
