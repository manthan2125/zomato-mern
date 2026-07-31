const foodModel = require("../models/food.model.js");
const storageService = require("../services/storage.service.js")
const { v4:uuid } = require("uuid")


async function createFood(req, res){
    // console.log(req.file);
    // req.body -> ke andar jo tum food item ki details hain wo hnogi(frontend se)
    // req.file -> hmari file ki detail hongi 
    // req.foodPartner -> logged in foodPartner ki detail

    const { name, description } = req.body;
    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid())
    // console.log("Food Controller : ",fileUploadResult);
    const foodItem = await foodModel.create({
        name: name,
        description,
        video : fileUploadResult.url,
        foodPartner : req.foodPartner._id
    })
    res.status(201).json({
        message: "Food Item created successfully",
        food: foodItem
    })
}

async function getFoodItems(req, res){
    const foodItems = await foodModel.find({});

    res.status(200).json({
        message: "Food Items fetched successfully",
        foodItems
    })
}


module.exports = {
    createFood,
    getFoodItems,
}