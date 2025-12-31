const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller.js');
const multer = require('multer');

const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 10 * 1024 * 1024,
	},
	fileFilter: (req, file, cb) => {
		if (file.mimetype && file.mimetype.startsWith('image/')) {
			cb(null, true);
			return;
		}

		cb(new Error('Only image uploads are allowed'));
	},
});

router.post('/user/register', authController.registerUser);
router.post('/user/login', authController.loginUser);
router.post('/user/logout', authController.logoutUser);
router.post('/partner/register', upload.single('avatar'), authController.registerFoodPartner);
router.post('/partner/login', authController.loginFoodPartner);
router.post('/partner/logout', authController.logoutFoodPartner);
router.get('/me', authController.getCurrentSession);

module.exports = router;