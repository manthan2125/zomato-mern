const express = require("express");
const foodController =require("../controllers/food.controller.js"); 
const authMiddleware = require("../middlewares/auth.middleware.js")
const multer = require("multer");
const router = express.Router();


const upload = multer({
    storage: multer.memoryStorage(),
})


/* POST - /api/food/ [protected] */
router.post("/", 
    authMiddleware.authFoodPartnerMiddleware,
    upload.single("video"),   // string ke andar wo naam dena hai jo schema ke andar hai ya frontend pr bhejte waqt hai
    foodController.createFood
)

/* GET - /api/food/ [protected] */
router.get("/",
    authMiddleware.authUserMiddleware,
    foodController.getFoodItems,
)

router.post("/like", 
    authMiddleware.authUserMiddleware, 
    foodController.likeFood
)

router.post("/save",
    authMiddleware.authUserMiddleware, 
    foodController.saveFood
)

module.exports = router;