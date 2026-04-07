import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";


// create token 
const createToken = (id) => {
    return  jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: '30d' });
}


// Route for User Login
const loginUser = async (req,res) => {
    try {
        const {email, password} = req.body;
        const user = await userModel.findOne({email});
        
        if(!user)
        {

           return res.status(400).json({ message: "User doesn,t exists" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        
        if(isMatch){
            const token = createToken(user._id)
            res.json({success:true,token});
        }
        else{
            res.json({success:false, message: 'Invalid Credentials'});
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
        
    }

}


// Route for User Registration
const registerUser = async (req,res) => {

    try {

        const { name, email, password } = req.body;

        // Check if user already exists
        const exists = await userModel.findOne({ email });
        if(exists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // validating email and strong Password
        if(!validator.isEmail(email)){
            return res.status(400).json({ message: "Please enter a valid email" });
        }
        if(!validator.isLength(password, { min: 6 })){
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // hasing user Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // creating new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user =await newUser.save()

        // token generation
        const token = createToken(user._id);

        res.status(201).json({success:true,token});

        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
        
    }
}

// Route for admin login
const adminLogin = async (req,res) => {
    try {
        
          const {email,password} = req.body;

          if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true,token});     
          }
          else{
            res.status(401).json({ message: "Invalid Creadiantials" });
          }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
        
        
    }

}

export { loginUser, registerUser, adminLogin };