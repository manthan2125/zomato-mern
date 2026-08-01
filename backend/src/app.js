// create server
const express = require('express');
const cookieParser = require("cookie-parser")
const authRoutes = require("./routes/auth.routes.js")
const foodRoutes = require("./routes/food.routes.js")
const foodPartnerRoutes = require("./routes/food-partner.routes.js")
const cors = require("cors")



const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());



app.get("/", (req, res) => {
    res.send("Hello, World");
});

// prefix
app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/food-partner", foodPartnerRoutes);



module.exports = app;