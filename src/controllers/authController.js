const {user} = require("../models/schemas")
const jwt = require('jsonwebtoken')

const createUser = async (req, res) => {
    try{
        let data = req.body
        if(!await user.exists(data)){
        let savedData = await user.create(data)
        res.status(201).send({msg: savedData})
        }
        else res.send({msg: "This User already exists."})
    }catch(err){
        res.status(204).send({msg: err.message})
    }
    
}

const loginUser = async (req, res) => {
    try{
        let data = req.body
        let userData = await user.findOne({emailId:data.emailId, password: data.password})
        if(userData){
        let token = jwt.sign({userId: userData._id.toString(), 
                                firstName: user.firstName,
                                age: user.age}, "Which came first, The Egg or the Chicken ??!")
        res.setHeader("x-Auth-Token", token)
        res.status(202).send({msg: token})
        }
        else res.status(404).send({status: false, msg: "This User credentials don't exist in our DB."})
    }catch (err) {
        res.status(500).send({Error: err.message})
    }
}

const fetchUser = async (req, res) => {
    try{
        let userDetails = await user.findById(req.params.userId)
        if(!userDetails) return res.send({msg: "User doesn't exist in DB."})
        if(!userDetails.isDeleted) return res.status(202).send({status: true, data: userDetails})
        res.status(404).send({msg: "You can't access this user data as it's deleted."})
    }catch(err) {
        res.status(500).send({Error: err.message})
    }
}

const updateDetails = async (req,res) => {
    try{
        let userDetails = await user.findById(req.params.userId)
        if(!userDetails) return res.status(204).send({msg: "User doesn't exist in DB."})
        let updatedUser = await user.findOneAndUpdate({ _id: req.params.userId}, req.body, {new: true});
        res.status(201).send({update: true, data: updatedUser})
    }catch(err) {
        res.status(500).send({Error: err.messgae})
    }
}

const deleteUserData = async (req,res) => {
    try{
        let userDetails = await user.findById(req.params.userId)
        if(!userDetails) return res.status(204).send({msg: "User doesn't exist in DB."})
        let updatedUser = await user.findOneAndUpdate({ _id: req.params.userId}, {isDeleted: true}, {new: true});
        res.status(200).send({update: true, data: updatedUser})
    }catch (err) {
        res.status(500).send({Error: err.message})
    }
}

module.exports = {createUser, loginUser, fetchUser, updateDetails, deleteUserData}
