
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("✅ Connected Successfully");
    process.exit(0);
})
.catch(err => {
    console.error(err);
});