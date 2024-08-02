
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const userSchema = require('../schemas/userSchema');
const User = mongoose.model('User', userSchema);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// signup
router.post('/signup', async (req, res) => {
    try {
        const hashedPass = await bcrypt.hash(req.body.password, 10);
        const userInfo = {
            name: req.body.name,
            username: req.body.username,
            password: hashedPass,
            status: req.body.status
        };
        const newUser = new User(userInfo);
        await newUser.save();
        res.status(200).send({ message: 'Signup was successful' });

    } catch (error) {
        res.status(500).json({ error: "Signup was failed" });
    }
});
// login
router.post('/login', async (req, res) => {
    try {
        const userArray = await User.find({ username: req.body.username });
        if (userArray && userArray.length > 0) {
            const isValidPass = bcrypt.compare(req.body.password, userArray[0].password);
            if (isValidPass) {
                // generate token
                const userInfo = {
                    username: userArray[0].username,
                    userId: userArray[0]._id,
                }
                const token = jwt.sign(userInfo, process.env.SECRET_TOKEN, {expiresIn: '1h'});
                res.status(200).send({ message: 'Login successful', token });

            }else{
                res.status(401).json({ error: "Authenticate Failed" });
            }
        }else{
            res.status(401).json({ error: "Authenticate Failed" });
        }
       

    } catch (error) {
        res.status(401).json({ error: "Authenticate Failure" });
    }
});
// get all users
router.get('/all', async(req,res)=>{
    try {
        const users = await User.find().populate("todos");
        res.status(200).send({ users });
        
    } catch (error) {
        console.log('sl')
        res.status(500).json({ error: "User was Not Found" });
    }
})


module.exports = router;