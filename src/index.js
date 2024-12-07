//  require('dotenv').config({path: './env'})

import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from "./app.js"

dotenv.config(
  {
    path: './env'
  }
)


connectDB()
.then(() =>{
  app.on("error", (error)=>{
  console.log("ERR: ", error)
  throw error
})
  app.listen(process.env.PORT, ()=>{
    console.log(`Database connected successfully on: ${process.env.PORT}`)
  })
  
})
.catch((error) =>{
  console.log("Database connection failed: ", error);
})






















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