const foodModel = require("../models/food.model.js");
const storageService = require("../services/storage.service.js")
const { v4:uuid } = require("uuid")
const likeModel = require("../models/likes.model.js");
const saveModel = require("../models/save.model.js");


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

async function likeFood(req, res){
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadyLiked = await likeModel.findOne({ user: user._id, food: foodId });

    if(isAlreadyLiked){
        await likeModel.deleteOne({   // already liked hai to unlike krwana hai
            user: user._id,
            food: foodId
        });

        await foodModel.findOneAndUpdate(foodId, {
            $inc: { likeCount: -1 }  // like count ko 1 se decrease krdo
        })
        return res.status(200).json({
            message: "Food unliked successfully"
        })
    }

    const like = await likeModel.create({
        user: user._id,
        food: foodId
    });

    await foodModel.findOneAndUpdate(foodId, {
        $inc: { likeCount: 1 }  // like count ko 1 se increase krdo
    })

    res.status(201).json({
        message: "Food liked successfully",
        like
    });
}

async function saveFood(req, res){
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadySaved = await saveModel.findOne({
        user: user._id,
        food: foodId
    })

    if(isAlreadySaved){
        await saveModel.deleteOne({
            user: user._id,
            food: foodId
        });

        return res.status(200).json({
            message: "Food unsaved successfully"
        });
    }

    const save = await saveModel.create({
        user: user._id,
        food: foodId
    });

    res.status(201).json({
        message : "Food save successfully",
        save
    });
}

module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
}