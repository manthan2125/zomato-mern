// start server
const dotenv = require("dotenv");
dotenv.config();

const { connect } = require('mongoose');
const app = require('./src/app.js');
const connectDB = require("./src/db/db.js");
connectDB();


app.listen(3000, () => {
    console.log("\nServer is running on port 3000");  
})