const foodModel = require('../models/food.model.js')
const partnerModel = require('../models/foodPrtner.model.js')
const storageService = require('../services/storage.services.js')
const {v4:uuid} = require('uuid');

async function cretaeFood(req, res){
    try {
        if (!req.file) {
            return res.status(400).json({
                message: 'video file is required to create a food item',
            });
        }

        const fileExtension = req.file.originalname?.split('.').pop();
        const generatedName = fileExtension ? `${uuid()}.${fileExtension}` : uuid();

        const fileUploadResult = await storageService.uploadFile(req.file.buffer, generatedName);

        const foodItem = await foodModel.create({
            name: req.body.name,
            description: req.body.description,
            video: fileUploadResult.url,
            foodPartner: req.foodPartner._id,
        });

        res.status(201).json({
            message: 'New food iteam created',
            foodItem: foodItem,
        });
    } catch (error) {
        console.error('create food failed', error);
        res.status(500).json({
            message: 'failed to create food item',
        });
    }
}

async function getFoodItem(req, res){
    const foodItem = await foodModel.find({})
    res.status(200).json({
        message: "food items fetched successfully",
        foodItem
    })
}

async function getProfile(req, res){
     try {
        const partnerId = req.params.id;

        // 1. Get partner ONCE
        const partner = await partnerModel.findById(partnerId);

        if (!partner) {
            return res.status(404).json({ message: "Food partner not found" });
        }

        // 2. Get only video URLs of foods
        const videos = await foodModel
            .find({ foodPartner: partnerId })
            .select("video -_id");

        res.json({
            partner,
            videos: videos.map(v => v.video)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function getDashboard(req, res){
    const {email} = req.query;
    try {
        const foodpartner = await partnerModel.find({email});
        const foodData = await foodModel.find({foodPartner:foodpartner[0]._id});
        res.status(200).json({
            foodpartner,
            foodData
        })
    } catch (err) {
        return res.status(401).json({
            message: "user not found"
        })
    }
}

module.exports={
    cretaeFood,
    getFoodItem,
    getProfile,
    getDashboard
}