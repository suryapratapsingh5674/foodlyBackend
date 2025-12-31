const express = require('express');
const router = express.Router()
const foodController = require('../controller/food.controller.js')
const authMiddleware = require('../middleware/auth.middleware.js')
const { validateCreateFood } = require('../middleware/food.validation.middleware.js')
const multer = require('multer');

const MAX_VIDEO_SIZE_MB = 110;

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: MAX_VIDEO_SIZE_MB * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype && file.mimetype.startsWith('video/')) {
            cb(null, true);
            return;
        }

        cb(new Error('Only video uploads are allowed'));
    },
})

router.post('/create', authMiddleware.isFoodPartner, upload.single("video"), validateCreateFood, foodController.cretaeFood);
router.get('/', authMiddleware.isUser, foodController.getFoodItem)
router.get('/partner/dashboard', authMiddleware.isFoodPartner, foodController.getDashboard)
router.get('/partner/:id', foodController.getProfile)

module.exports = router