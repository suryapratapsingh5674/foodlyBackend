const userModel = require('../models/user.model.js');
const foodPartnerModel = require('../models/foodPrtner.model.js')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const storageService = require('../services/storage.services.js')
const { v4: uuid } = require('uuid');

const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
}

const registerUser = async (req, res) => {
    const {fullName, email, password} = req.body;

    const isUserAlreadyExist = await userModel.findOne({
        email
    })

    if(isUserAlreadyExist){
        return res.status(400).json({
            messege: "user already exist"
        })
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        name: fullName,
        email,
        password: hashedpassword
    })

    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET);

    res.cookie("token", token, cookieOptions);
    res.status(201).json({
        message: "user created succfully",
        user: {
            id: user._id,
            email: user.email,
            fullname: user.name
        }
    })
}

const loginUser = async (req, res) => {
    const {email, password} = req.body;

    const User = await userModel.findOne({email});

    if(!User){
        return res.status(400).json({
            messege: "Invalid email or password"
        });
    }

    const isPasswordMatch = await bcrypt.compare(password, User.password);

    if(!isPasswordMatch){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign({
        id: User._id 
    },process.env.JWT_SECRET);

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
        message: "User login successfully",
        user: {
            id: User._id,
            name: User.name
        }
    })

}

const logoutUser = (req, res)=>{
    res.clearCookie("token", {
        httpOnly: cookieOptions.httpOnly,
        sameSite: cookieOptions.sameSite,
        secure: cookieOptions.secure,
    })
    res.status(200).json({
        message: "logout successfully."
    })
}

const registerFoodPartner = async (req, res) => {
    try {
        const { fullName, contactName, phone, email, password, address } = req.body || {};

        if (!fullName || !contactName || !phone || !email || !password || !address) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const isPartnerAlreadyExist = await foodPartnerModel.findOne({ email });
        if (isPartnerAlreadyExist) {
            return res.status(400).json({ message: 'Partner already exists' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Avatar image is required' });
        }

        const fileExtension = req.file.originalname?.split('.').pop();
        const generatedName = fileExtension ? `${uuid()}.${fileExtension}` : uuid();
        const fileUploadResult = await storageService.uploadFile(req.file.buffer, generatedName);

        const hashedPassword = await bcrypt.hash(password, 10);

        const partner = await foodPartnerModel.create({
            avatar: fileUploadResult.url,
            fullName,
            contactName,
            phone,
            email,
            password: hashedPassword,
            address,
        });

        const token = jwt.sign({ id: partner._id }, process.env.JWT_SECRET);

        res.cookie('token', token, cookieOptions);
        res.status(201).json({
            message: 'Food partner created successfully.',
            user: {
                id: partner._id,
                email: partner.email,
                fullName: partner.fullName,
            },
        });
    } catch (error) {
        console.error('register food partner failed', error);
        res.status(500).json({ message: 'Failed to register food partner' });
    }
}

const loginFoodPartner = async (req, res) => {
    const {email, password} = req.body;

    const user = await foodPartnerModel.findOne({email})

    if(!user){
        return res.send('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return res.send('Invalid email or password');
    }

    const token = jwt.sign({
        id:user._id
    }, process.env.JWT_SECRET);

    res.cookie("token", token, cookieOptions);
    res.status(200).json({
        message:"login successfully",
        user:{
            name:user.name,
            email: user.email
        }
    })
}

const logoutFoodPartner = (req, res) => {
    res.clearCookie("token", {
        httpOnly: cookieOptions.httpOnly,
        sameSite: cookieOptions.sameSite,
        secure: cookieOptions.secure,
    });
    res.status(200).json({
        message: "logout successfully"
    })
}

const getCurrentSession = async (req, res) => {
    const token = req.cookies?.token

    if (!token) {
        return res.status(200).json({
            user: null,
            accountType: null,
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const [user, partner] = await Promise.all([
            userModel.findById(decoded.id).lean(),
            foodPartnerModel.findById(decoded.id).lean(),
        ])

        if (user) {
            const { _id, email, fullNmae, name } = user
            return res.status(200).json({
                user: {
                    id: _id,
                    email,
                    fullName: fullNmae || name || '',
                },
                accountType: 'user',
            })
        }

        if (partner) {
            const { _id, email, fullName, contactName, phone, address, avatar } = partner
            return res.status(200).json({
                user: {
                    id: _id,
                    email,
                    fullName,
                    contactName,
                    phone,
                    address,
                    avatar,
                },
                accountType: 'partner',
            })
        }

        return res.status(200).json({
            user: null,
            accountType: null,
        })
    } catch (error) {
        res.clearCookie('token', {
            httpOnly: cookieOptions.httpOnly,
            sameSite: cookieOptions.sameSite,
            secure: cookieOptions.secure,
        })
        return res.status(200).json({
            user: null,
            accountType: null,
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner,
    getCurrentSession
}; 
