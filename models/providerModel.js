const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")



const providerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 4 characters"],
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "PLease Enter valid Email"]

    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false,
    },
    avatar: {
            type: String,
    },
    role: {
        type: String,
        default: "provider",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    assignedTasks: {
        type: [String],
        default: null
    },
    category: {
        type: String,
        required: true,
        enum: ["Transportation", "Field Service", "IT Service", "Education", "Food Delivery"],
    },
    completedTasksCount: {
        type: Number,
        default: 0,
    },
    taskHistory: [
        {
            taskId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Task",
            },
            completedAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    reviews: [
        {
            consumerId: mongoose.Schema.Types.ObjectId,
            rating: {
                type: Number,
                min: 1,
                max: 5,
            },
            comment: String,
        },
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
})

// Passord Double Hash
providerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)
})

// JWT TOKEN 
providerSchema.methods.providerGetJWTToken = function () {
    return jwt.sign({ id: this.id }, process.env.SECRET);
  };
  


// Compare Password

providerSchema.methods.providerComparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model("Provider", providerSchema)