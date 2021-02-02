const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET
const requireLogin = require('../middleware/requireLogin');
// ?????????????????????????
// const User = mongoose.model("User");
//??????????????????????????


router.get('/protected', requireLogin, (req, res) => {
    res.send("hello sir");

})


router.get('/', (req, res) => {
    res.json('hey')
    res.send('hello');
});

//singup & check somone exist with this email 
router.post('/singup', async (req, res) => {
    // console.log('body' ,req.body);
    const { name, email, password } = req.body;
    // console.log('name', name);
    if (!email || !password || !name) { return res.status(422).json({ error: "please add all the field" }) }   //422 server has undertand and couldnt response that
    try {
        const UserFound = await User.findOne({ email: email });// check user Exist 
        if (UserFound) { return res.status(422).json({ message: "User Already Exist with this Email" }) }


        const hashedPassword = await bcrypt.hash(password, 12)//make simple password to hash

        const user = new User({
            email,
            name,
            password: hashedPassword
        });


        const saved = await user.save();
        res.json(saved);




    } catch (error) {
        console.log('error', error)
    }

});

//singin in User
router.post('/singin', async (req, res) => {
    const { email, password } = req.body;//get Email and password
    if (!email || !password) { return res.status(422).json({ error: "Please add email or password " }) }//check Inputs Entered or not
    try {
        const FindUser = await User.findOne({ email });// search user email-Id entered are valid 
        if (!FindUser) { return res.status(422).json({ error: "Invalid Email or Password" }) }//email not found User not exist
        const Matched = await bcrypt.compare(password, FindUser.password)//compare password with database
        if (Matched) {
            // console.log('matched',Matched);

            // res.json({message:"successfully singin"})
            const token = jwt.sign({ _id: FindUser._id }, JWT_SECRET);
            res.json({ token });

        }//password matched singin
        return res.status(422).json({ error: "Invalid  Password" })//invalid passwird

    } catch (error) {
        console.log('err', error);
    }
})

module.exports = router;