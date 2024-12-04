import mongoose from "mongoose";
import { JsonWebTokenError } from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
  userName: {
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    trim: true, 
    index: true
  },
  email: {
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  fullName: {
    String: true,
    required: true,
    trim: true,
    index: true,
  }, 
  avatar: {
    type: String,
    requied: true,
  },
  userImage: {
    type: String
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  }, 
  refreshToken: {
    type: String,
  },
  watchHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video"
    }
  ]

},
{timestamps: true})

userSchema.pre("save", async function (next){
  if(!this.isModified()) return next();
 
  this.password = bcrypt.hash(this.password, 10);
  next()
})

userSchema.methods.isPasswordCorrect = async function (password){
  return await bcrypt.compare(password, this.password);
}

userSchema.method.generateAccessToken = function (){
  return JsonWebTokenError.sign({
    _id: this._id,
    email: this.email,
    userName: this.userName,
    fullName: this.fullName,
  },
  process.env.ACCESS_TOKEN_SECRET,
  {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,  
  }
)
}

userSchema.method.generateRefreshToken = function (){
  return JsonWebTokenError.sign({
    _id: this._id,
  },
  process.env.REFRESH_TOKEN_SECRET,
  {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,  
  }
)
}

export const User = mongoose.model("User", userSchema);