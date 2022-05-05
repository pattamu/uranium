const internModel = require('../models/internmodel')
const collegeModel = require('../models/collegeModel')

//validation checking function 
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const createIntern = async (req,res) => {
    try{
        let data = req.body
        delete data.collegeId
        let nameRegEx = /^[A-z]*$|^[A-z]+\s[A-z]*$/
        let emailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        let mobileRegEx = /^(\+\d{1,3}[- ]?)?\d{10}$/

        if(!isValidRequestBody(data))
            return res.status(400).send({
                status: false,
                msg: "Please enter some data to create Intern Details."})
        
        if(!isValid(data.name))
            return res.status(400).send({
                status: false,
                msg: "Please enter your Name."})
        
        if(!data.name.trim().match(nameRegEx))
            return res.status(400).send({
                status: false,
                msg: "Enter a Valid Name."}) 
        
        data.name = data.name.split(' ').map(x => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()).join(' ')
        
        if(!isValid(data.email))
            return res.status(400).send({
                status: false,
                msg: "Please enter your E-Mail Address."})

        if(!data.email.trim().match(emailRegEx))
            return res.status(400).send({
                status: false,
                msg: "Enter a Valid E-Mail Address."}) 
        
        if(!isValid(data.mobile))
            return res.status(400).send({
                status: false,
                msg: "Please enter your E-Mail Address."})

        if(!data.mobile.trim().match(mobileRegEx))
            return res.status(400).send({
                status: false,
                msg: "Enter a Valid Mobile Number."}) 
        
        if(!isValid(data.collegeName))
            return res.status(400).send({
                status: false,
                msg: "Please enter College Name."})

        let collegeData = await collegeModel.findOne({name: data.collegeName})
        if(!collegeData)
            return res.status(404).send({
                status: false,
                msg: "No such College available, Please enter a Valid College Name."
            })
        
        delete data.collegeName

        if(await internModel.exists(data))
            return res.status(400).send({
                status:false,
                msg: "This Intern details already exists in our Database."})
        
        data.collegeId = collegeData._id
        console.log(data)
        let intern = await internModel.create(data)
        res.status(201).send({
            status:true,
            data: intern})
    }
    catch(err){
        console.log(err.message)
        if(err.message.includes('E11000' && 'email'))
            return res.status(500).send({
                status: false,
                msg: "Please Enter an unique E-Mail."})

        if(err.message.includes('E11000' && 'mobile'))
            return res.status(500).send({
                status:false,
                msg: "Please Enter an unique mobile number."})
        
        res.status(500).send({status:false, msg: err.message})
    }
}

const getInters = async (req,res) => {
    try{
        let data = req.query
        if(!data.collegeName || !isValid(data.collegeName) || (/[^-.a-zA-Z]/.test(data.collegeName)))
            return res.status(400).send({
                status:false,
                msg: "Please Enter Valid college Short name."})
        
        let findCollege = await collegeModel.findOne({name: data.collegeName})

        if(!findCollege)
            return res.status(404).send({
                status:false,
                msg: "College not Found."})
        
        let findInterns = await internModel.find({
            collegeId:findCollege._id, 
            isDeleted: false},
            {
            collegeId:0,
            isDeleted:0,
            createdAt:0,
            updatedAt:0,
            __v:0
        })
        
        if(!findInterns.length)
            return res.status(404).send({
                status: false,
                msg: "No Interns have registered in this college."})
        
        res.status(200).send({
            status: true,
            data:{
                "name": findCollege.name,
                "fullName": findCollege.fullName,
                "logoLink": findCollege.logoLink,
                "interests":findInterns
            }
        })
    }
    catch(err){
        console.log(err.message)
        res.status(500).send({
            status:false,
            msg: err.message})
    }
}

module.exports = {createIntern, getInters}