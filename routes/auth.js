const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {

    const existingUser = await User.findOne({email: req.body.email});
    if(existingUser){
        return res.status(400).json({message: "Email already exists"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        email: req.body.email,
        password: hashedPassword
    });
    try{
        const savedUser = await user.save();
        res.status(200).json({message: "Success"});
    }
    catch(err){
        res.status(400).json({message: "Something is wrong"})
        
    }
})

router.post("/login", async (req, res) => {
    const validUser = await User.findOne({email: req.body.email});
    if(!validUser){
        return res.status(400).json({message: "Email or password is invalid"});
    }

    const validPassword = await bcrypt.compare(req.body.password, validUser.password);
    if(!validPassword){
        return res.status(400).json({message: "Email or password is invlaid"});
    }

    const token = jwt.sign({_id: validUser._id}, process.env.tokenSecret);
    res.status(200).json({message: "Success", token: token});

})

module.exports = router;