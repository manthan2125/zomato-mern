const foodModel = require("../models/food.model.js");
const storageService = require("../services/storage.service.js")
const { v4: uuid } = require("uuid")
const likeModel = require("../models/likes.model.js");
const saveModel = require("../models/save.model.js");


async function createFood(req, res) {
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
        video: fileUploadResult.url,
        foodPartner: req.foodPartner._id
    })
    res.status(201).json({
        message: "Food Item created successfully",
        food: foodItem
    })
}

async function getFoodItems(req, res) {
    const foodItems = await foodModel.find({});   // foodItmes array of objects of food

    res.status(200).json({
        message: "Food Items fetched successfully",
        foodItems
    })
}

async function likeFood(req, res) {
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadyLiked = await likeModel.findOne({ user: user._id, food: foodId });

    if (isAlreadyLiked) {
        await likeModel.deleteOne({   // already liked hai to unlike krwana hai
            user: user._id,
            food: foodId
        });
        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: -1 }  // like count ko 1 se decrease krdo
        })
        return res.status(200).json({
            message: "Food unliked successfully",
            like: false    // ---------------
        })
    }
    const like = await likeModel.create({
        user: user._id,
        food: foodId
    });
    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: 1 }  // like count ko 1 se increase krdo
    })
    res.status(201).json({
        message: "Food liked successfully",
        like
    });
}

async function saveFood(req, res) {
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadySaved = await saveModel.findOne({
        user: user._id,
        food: foodId
    });

    if (isAlreadySaved) {
        await saveModel.deleteOne({
            user: user._id,
            food: foodId
        });

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { saveCount: -1 }
        });

        return res.status(200).json({
            message: "Food unsaved successfully",
            save: false
        });
    }

    const save = await saveModel.create({
        user: user._id,
        food: foodId
    });
    await foodModel.findByIdAndUpdate(foodId, {
            $inc: { saveCount: 1 }
        });

    return res.status(201).json({
        message: "Food saved successfully",
        save
    });
}

async function getSavedFood(req, res){
    const user = req.user;
    const savedFoods = await saveModel.find({ user: user._id }).poulate("food");

    if(!savedFoods || savedFoods.length === 0){
        return res.status(404).json({
            message: "No saved food items found",
            savedFoods: []
        });
    }

    res.status(200).json({
        message: "Saved food items fetched successfully",
        savedFoods
    });
}

module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSavedFood
}