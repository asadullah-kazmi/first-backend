//  require('dotenv').config({path: './env'})

import dotenv from "dotenv"

import express from "express"
import connectDB from "./db/index.js";

dotenv.config(
  {
    path: './env'
  }
)

const app = express()


connectDB();






















// ;(async ()=>{
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//     app.on("error", (error) =>{
//       console.error("Error: "+ error)
//       throw error
//     })
//   } catch (error) {
//     console.error("Error: "+ error);
//     throw error
//   }
// })()