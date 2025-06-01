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
        const verifyEmail = await User.findOne({ email: email })
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
                },
                process.env.JWT_SECRET,
                    { expiresIn: "1h" }
                    );
                
          return res.status(200).json({ accessToken: jwtToken, userID: user.userId });
    } catch (err) {
    res.status(500).json({ error: err.message });
  }
});