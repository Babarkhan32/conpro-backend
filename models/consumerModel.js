const mongoose = require("mongoose");
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


const consumerSchema = new mongoose.Schema({
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
        validate:[validator.isEmail,"PLease Enter valid Email"]
        
      },
      password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false,
      },
      avatar: {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
      role: {
        type: String,
        default: "user",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },

      resetPasswordToken:String,
      resetPasswordExpire: Date,
})

// Passord Double Hash
consumerSchema.pre("save", async function(next){
  if(!this.isModified("password")){
    next();
  }
  this.password = await bcrypt.hash(this.password,10)
})

// consumerSchema.methods.getJWTToken = function(){
//   return jwt.sign({id:this.id}, DSKJFBUKSEFBSDJFBSSEREEUFBEFBS,{
//       expiresIn: process.env.JWT_EXPIRE,
//   })
// };

// JWT TOKEN 
consumerSchema.methods.getJWTToken = function () {
  
  return jwt.sign({ id: this.id }, process.env.SECRET, {
      expiresIn: process.env.EXPIRE,
  })
};

console.log(process.env.JWT_EXPIRES)

// Compare Password

consumerSchema.methods.comparePassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password)
}
module.exports = mongoose.model("Consumer", consumerSchema)