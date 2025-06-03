//APIproject/user/models/user.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId:{
    type:String,
    required: true,
    unique: true,
  },
    firstName: {
    type: String,
    required: true,
     trim: true ,
  },
  lastName: {
    type: String,
    required: true,
     trim: true ,
  },
  email: {
    type: String,
    required: true,
    unique: true,
     trim: true 
    // Ensures no duplicate emails
  },
  birthDay: { 
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be at least 8 characters"],
  },
  isAdmin: {
  type: Boolean,
  default: false, 
},
  favoriteList: [{ 
    type: String, 
    ref: "Product", 
    default: [] }]
,
myProducts: [{ 
  type: String, 
  ref: "Product", 
  default: [] }]
,
}, 
{ 
  timestamps: true 
}); // ✅ Adds createdAt & updatedAt automatically

export default mongoose.model("User", userSchema);
