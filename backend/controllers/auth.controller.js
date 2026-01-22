const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');

const login = async (req, res) => {
    const { email, password } = req.body;
    try{
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json("User not found");
        }
        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.status(400).json("Invalid credentials");
        }

       const token =  jwt.sign({id:user._id,name:user.name},process.env.JWT_SECRET,{expiresIn:"1d"});
        return res.status(200).json({token,message:"Login Successfull"})
    }catch(error){
        console.log(error)
        return res.status(500).json("Server Error");
    }
}

const register = async(req,res)=>{
    const {name,email,password} = req.body;
    try {
        const isPresent = await User.findOne({email})
        if(isPresent){
            return res.status(400).json("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const newUser = new User({
            name,
            email,
            password:hashedPassword
        })
        await newUser.save();
        return res.status(201).json("User registered successfully");
    } catch (error) {
        console.log(error);
        return res.status(500).json("Server Error");
    }
}

module.exports = {login,register};