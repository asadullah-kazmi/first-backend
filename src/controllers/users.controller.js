import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asynHandler.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async(req, res) =>{
  const {fullName, email, userName, password} = req.body
  console.log("email: ", email)
  console.log("Full Name: ", fullName)

  if([fullName, email, userName, password].some((field) => field?.trim === "")){
    throw new ApiError(400, "All fields are compulsory")
  }

  const existedUserWithEmail = User.findOne({email})
  if(existedUserWithEmail){
    throw new ApiError(409, "User already exist with same email")
  }

  const existedUserWithName = User.findOne({userName})
  if(existedUserWithName){
    throw new ApiError(409, "User already exist with same Username")
  }
 
   /*
   Another method to check if user already exist
    const existedUser = User.findOne({
      $or: [{email}, {userName}]
    })
   */
  const avatarLocalFilePath = req.files?.avatar[0]?.path;
  const coverImageLocalFilePath = req.files?.coverImage[0]?.path;

  if(!avatarLocalFilePath){
    throw new ApiError(400, "Avatar is required")
  }

  const avatar = await uploadOnCloudinary(avatarLocalFilePath)
  const coverImage = await uploadOnCloudinary(coverImageLocalFilePath)

  if(!avatar){
    throw new ApiError(400, "Avatar is required")
  }

  const user = await User.create({
    email,
    fullName,
    userName : userName.toLowerCase,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    password
  })

  const userCreated = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if(!userCreated){
    throw new ApiError(400, "Something went wrong while adding user in database")
  }

  return res.status(201).json(
    new ApiResponse(200, "User added successfully", userCreated)
  )

})

export {registerUser}