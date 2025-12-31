const foodPartnerModel = require('../models/foodPrtner.model.js')
const userModel = require('../models/user.model.js')
const jwt = require('jsonwebtoken')

async function isFoodPartner(req, res, next){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message: "login as food partner to add food item"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const foodPartner = await foodPartnerModel.findById(decoded.id);

        if(!foodPartner){
            return res.status(401).json({
                message: "food partner don't exist."
            })
        }

        req.foodPartner = foodPartner;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "invalid token"
        })
    }
}

async function isUser(req, res, next){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message: "login first from user account."
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);

        if(!user){
            return res.status(400).json({
                message: "user don't exist"
            })
        }

        next()
    } catch (error) {
        return res.status(401).json({
            message: "invalid token"
        })
    }
}

module.exports = {isFoodPartner, isUser};