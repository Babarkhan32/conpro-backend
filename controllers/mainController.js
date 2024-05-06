const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const ErrorHandler = require("../utils/errorhandler");
const Consumer = require("../models/consumerModel");
const Provider = require("../models/providerModel")
const Request = require("../models/requestModel")
const sendToken = require("../utils/jwtToken")
const bcrypt = require('bcrypt');
const { response } = require("express");


exports.addUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password, role, category, avatar } = req.body;

    let createdUser


    if (role === "consumer") {
        createdUser = await Consumer.create({
            name, email, password, role, avatar:""
        });
    } else {
        createdUser = await Provider.create({
            name, email, password, role, category, avatar:""
        });
    }

    sendToken(createdUser, 201, res)
});



// Login Function 
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;


    if (!email || !password) {
        return next(new ErrorHandler("Please enter Email and Password", 400));
    }

    // Find user in both Consumer and Provider collections
    const consumer = await Consumer.findOne({ email }).select("+password");
    const provider = await Provider.findOne({ email }).select("+password");

    let user;

    // Determine user based on which collection (Consumer or Provider) has a matching user
    if (consumer) {
        user = consumer;
    } else if (provider) {
        user = provider;
    } else {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    // Compare entered password with hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }
    sendToken(user, 200, res);
});

//Logout 

exports.logoutUser = catchAsyncErrors(async (req, res, next) => {

    res.removeHeader('Authorization');

    res.status(200).json({
        success: true,
        message: "User logged out successfully"
    });
})

// exports.editProfile = catchAsyncErrors(async(req,res,next) => {

//     const id = req.id

//     let user;
//     const consumer = await Consumer.findById(id)
//     const provider = await Provider.findById(id)

//     if(consumer === null){
//         user = provider
//     } else {
//         user = consumer
//     }

// })

exports.getProfile = catchAsyncErrors(async(req,res,next) => {
    const id = req.id

    const consumer = await Consumer.findById(id)
    const provider = await Provider.findById(id)



    if(consumer === null){
        user = provider
    } else {
        user = consumer
    }
    
    res.status(200).json({
        success:true,
        user
    })
})

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const userId = req.id; 
    const { name, email , avatar} = req.body;
    let user;


    try {

        const consumer = await Consumer.findById(userId)
        const provider = await Provider.findById(userId)

        if(consumer === null){
            user = provider
        } else {
            user = consumer
        }

        if (name) user.name = name;
        if (email) user.email = email;

        if (req.file) {
            let forwardPath = req.file.path.replace(/\\/g, '/');
            user.avatar = forwardPath; 
        }

        // // Save the updated user profile
        await user.save();


        // Send a success response
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user
        });
    } catch (error) {
        // Handle errors
        next(error);
    }
});

    exports.updatePassword = catchAsyncErrors(async(req,res,next) => {
        
        const id = req.id
        const {currentPassword, newPassword} = req.body;
        let user 
        try {

            const consumer = await Consumer.findById(id).select("+password")
            const provider = await Provider.findById(id).select("+password")

            if(consumer === null){
                user = provider
            } else {
                user = consumer
            }

            const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);

            if (!isPasswordCorrect) {
                return res.status(400).json({ error: 'Current password is incorrect' });
            }

            user.password = newPassword; 
            await user.save(); 

            res.status(200).json({
                success:true,
                message: "Password updated successfully"
            })

            

        } catch (error) {
            next(error);
        }
    })
