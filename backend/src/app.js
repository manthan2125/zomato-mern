// create server
const express = require('express');
const cookieParser = require("cookie-parser")
const authRoutes = require("./routes/auth.routes.js")



const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());


app.get("/", (req, res) => {
    res.send("Hello, World");
});

// prefix
app.use("/api/auth", authRoutes);



module.exports = app;