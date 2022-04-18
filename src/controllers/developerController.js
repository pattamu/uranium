const mySchema = require("../models/schemas")

const createBatch = async (req, res) => {
    let data = req.body
    let savedData = await mySchema.batch.create(data)
    res.send({msg: savedData})
}

const createDeveloper = async (req, res) => {
    let data = req.body
    if(data.batch){
        let b_check = await mySchema.batch.find({_id: data.batch})
        if(b_check.length){
            if(!await mySchema.developer.exists(data)){
                let savedData= await mySchema.developer.create(data)
                res.send({msg: savedData})
            }
            else res.send({msg: "This Develpoer already exists in our DB"})
        }
        else res.send({msg: "The Batch ObjectId is Invalid."})
    }
    else res.send({msg: "You must enter Batch ObjectId."})
}

const scholarship_developers = async(req, res) => {
    let scolars = await mySchema.developer.find({gender: "female", percentage: {$gte: 70}},{name: 1,gender: 1, percentage: 1, _id: 0})
    res.send({msg: scolars})
}

const getDeveloper = async(req, res) => {
    let findBatch_OID = await mySchema.batch.find({name: req.query.program})
    let eligible = await mySchema.developer.find({batch: findBatch_OID, percentage: {$gte: req.query.percentage}})
                                            .select({name: 1,gender: 1, percentage: 1, _id: 0})
    if(eligible.length) res.send({msg: eligible})
    else res.send({msg: "No Such Developers found in this Batch."})
}

module.exports = {createBatch, createDeveloper, scholarship_developers, getDeveloper}
