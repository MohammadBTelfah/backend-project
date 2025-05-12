const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
    res.status(500).json({Message: error.Message});
    }
}
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
        
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user' });
        
    }
   }

exports.createUser = async (req, res) => {
    const {Name , Email, Password,role} = req.body;
    try {
        const user = {Name, Email, Password,role}
        const savedUser = new User(user)
        await savedUser.save()
        res.status(200).json({ savedUser, Message: 'User created successfully' })
    } catch (error) {
        res.status(500).json({Message: error.Message})
    }
}

exports.getUserByname = async (req, res) => {
    const {Name}=req.body
    try {
        const user = await User.find({Name:Name})
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({Message: error.Message})
    }
}
exports.updateUser = async (req, res) => {
    const {id} = req.params
    const {Name, Email, Password,role} = req.body
    try {
        const User= await User.findByIdAndUpdate (id, {Name, Email, Password,role})
        res.status(200).json({message: 'User updated successfully'})
        } catch (error) {
            res.status(500).json({Message: error.Message})
        }
    }
    exports.deleteUser = async (req, res) => {
        const {id} = req.params
            try {
                await User.findByIdAndDelete(id)
                res.status(200).json({message: 'User deleted successfully'})
            } catch (error) {
                res.status(500).json({Message: error.Message})
            }
        }


exports.login = async (req, res) => {
            const {Email, Password} = req.body
            console.log('you are in login url')
            try {
                const user = await User.findOne({Email:Email})
                if(!user){
                    return res.status(400).json({Message: 'User not found'})
                }
                const isMatch = await bcrypt.compare(Password, user.Password)
                if(!isMatch){
                    return res.status(400).json({Message: 'Invalid Password'})
                }
                const token = jwt.sign({userId: user._id, role: user.role}, SECRET_KEY, {expiresIn: '1h'})
                res.status(200).json({Message: 'User logged in successfully', token})
            } catch (error) {
                res.status(500).json({Message: error.message})
            }
        }