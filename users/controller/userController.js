//APIproject/user/controller/userController.js
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import User from "../models/user.js"

export const register = asyncHandler(async (req, res) => {
    try{
        console.log("🔍 Checking if email exists...");
        const { firstName,lastName, email, password, birthDay } = req.body;
        const verifyEmail = await User.findOne({email: email})
         console.log("🔍 email exists...?",verifyEmail);
        if (verifyEmail) {
            return res.status(403).json({
                message: "Email already used"
            })} 
            if(!firstName || !lastName || !email || !birthDay || !password){
               return res.status(400).json({ error: "All fields are required!" });
            }
            else{
                const userId = uuidv4()
                console.log("Generated UUID:", userId);
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                const newUser = new User({ 
                    userId: userId,
                    firstName:firstName,
                    lastName:lastName,
                    email:email,
                    birthDay:birthDay,
                    password:hashedPassword
                 });
               const user = await newUser.save();
               console.log("🔍 Query Result:", user);
               res.status(201).json({ message: "User created successfully", user });
             }
     } catch (err) {res.status(500).json({ error: err.message });   
     }

})

export const login = asyncHandler(async (req, res) => {

    try{
    const { email, password } = req.body
    const user = await User.findOne({ email });
    if (!user) {
    return res.status(404).json({ error: "Email not found. Please register." });
    }
    const response= await bcrypt.compare(password, user.password);
    if (!response) {
        return res.status(401).json({message: "Authentication Failed"});
         }
            let jwtToken = jwt.sign(
                {
                email: user.email,
                userId: user.userId,
                isAdmin: user.isAdmin, // ✅ Add this field
                },
                process.env.JWT_SECRET,
                    { expiresIn: "1h" }
                    );
                
          return res.status(200).json({ accessToken: jwtToken, userID: user.userId });
    } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export const userProfile = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    try {
        //verifying if the user exist in the database
        const verifyUser = await User.findOne({ userId: id })
        if (!verifyUser) {
            return res.status(403).json({
                message: "user not found",
                success: false,
            })
        } else {
           return res.status(200).json({
             message: `user ${verifyUser.firstName} ${verifyUser.lastName}`,
             success: true
            });
        }
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message,
        })
    }
});
export const updateUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        // Ensure users can only update their own profile unless they are admin
        if (req.userData.userId !== id && !req.userData.isAdmin) {
            return res.status(403).json({ message: "You can only update your own profile." });
        }
        const updates = req.body;
        // Prevent updating isAdmin
        if ("isAdmin" in updates) {
            return res.status(403).json({ message: "You cannot update isAdmin." });
        }
        const updatedUser = await User.findOneAndUpdate({ userId: id }, updates, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
export const deleteUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        // Ensure users can only delete their own account unless they are admin
        if (req.userData.userId !== id && !req.userData.isAdmin) {
            return res.status(403).json({ message: "You can only delete your own account." });
        }
        const deletedUser = await User.findOneAndDelete({ userId: id });
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
export const getAllusers = asyncHandler(async (req, res) =>{
     // phase 1 - filtering
    let queryObj = { ...req.query };
    ['page', 'sort', 'limit', 'fields']
        .forEach(el => delete queryObj[el]);  // phase 2 - advance filtering
    const strQuery = JSON.stringify(queryObj)
        .replace(/\b(gte|gt|lte|lt)\b/g,
            match =>`$${match}`);
    queryObj = JSON.parse(strQuery);
    console.log("Received Query Params:", req.query);
    console.log("Processed Query Object:",queryObj);
    
    const sort = req.query.sort ?req.query.sort.split(',').join(' ') : "";
    
    const selected = req.query.fields ? req.query.fields.split(',').join(' ') : "";
     const limit = req.query.limit || 100;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;
    
    try{
       const documents = await User.countDocuments(queryObj);
       
       if (documents === 0) {
          return res.status(200).json({ success: true, data: [], message: "No users found." });
            }
        if (skip >= documents && documents > 0) {
           return res.status(404).json({
              success: false,
              message: "Requested page exceeds available data.",
         });
      }
        const users = await User.find(queryObj)
       .skip(skip)
       .limit(limit)
       .select(selected)
       .sort(sort);
        console.log(users)
        return res.status(200).json({
           data: users,
           success: true, 
           page,
           limit,
           totalPages: Math.ceil(documents / limit),
           documents,
           message: "users list"
         });
    } catch (error) {
        return res.status(500).json({
           success: false, 
           message: error.message,
          });

    }
})
export const upgradeToAdmin = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { confirmAdmin } = req.body; // Requires a confirmation field
        // Check confirmation field
        //"confirmAdmin": "YES"
        if (!confirmAdmin || confirmAdmin !== "YES") {
            return res.status(400).json({ message: "Confirmation required to update user to Admin." });
        }
        // Find and update user
        const updatedUser = await User.findOneAndUpdate(
            { userId: id },
            { isAdmin: true },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json({ message: "User upgraded to Admin successfully.", user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});