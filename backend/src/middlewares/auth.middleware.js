const foodPartnerModel = require("../models/foodpartner.model.js");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model.js")

async function authFoodPartnerMiddleware(req, res, next){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            message: "Please login first"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const foodPartner = await foodPartnerModel.findById(decoded.id);
        req.foodPartner = foodPartner;
        next();
    }
    catch(err){
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}
// async function authUserMiddleware(req, res, next){
//     const token = req.cookies.token;

//     if(!token){
//         return res.status(401).json({
//             message: "Please login first"
//         })
//     }
//     try{
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const loggedInUser = await userModel.findById(decoded.id);
//         req.user = loggedInUser;
//         next()
//     }
//     catch(err){
//         return res.status(401).json({
//             message: "Invalid token"
//         })
//     }

// }


module.exports = {
    authFoodPartnerMiddleware,
    // authUserMiddleware,
}