const foodPartnerModel = require("../models/foodpartner.model.js");
const foodModel = require("../models/food.model.js");

async function getFoodPartnerById(req, res){
    const foodPartnerId = req.params.id;
    const foodPartner = await foodPartnerModel.findById(foodPartnerId);
    const foodItemsByFoodPartner = await foodModel.find({foodPartner: foodPartnerId})   // array of objects


    if(!foodPartner){
        return res.status(404).json({
            message: "Food Partner not found"
        })
    }
    res.status(200).json({
        message: "Food Partner fetched successfully",
        foodPartner: 
        {
            ...foodPartner.toObject() ,  // first mongoose object created into normal js object and then make a copy using spread op and store it into new obj
            foodItems: foodItemsByFoodPartner   // array of objects
        }
    })
}

module.exports = {
    getFoodPartnerById
}