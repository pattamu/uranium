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

const createCollege = async (req,res)=> {
    try{
        let data = req.body
        let nameRegEx = /^[a-zA-Z.]+$/
        let fullNameRegEx = /^[A-Za-z\s]{1,}[\,]{0,1}[A-Za-z\s]{0,}$/
        let urlRegEx = /^(http(s)?:\/\/)?(www.)?([a-zA-Z0-9])+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\/[^\s]*)?$/gm

        if(!isValidRequestBody(data))
            return res.status(400).send({
                status: false, 
                msg: "Please Enter college details to create college Data."})

        if(!isValid(data.name))
            return res.status(400).send({
                status: false, 
                msg: "Please Enter the Short Name of college."})
        
        if(!nameRegEx.test(data.name.trim()))
            return res.status(400).send({
                status: false, 
                msg: "Please Enter a valid college Short Name."})
        
        if(!isValid(data.fullName))
            return res.status(400).send({
                status: false, 
                msg: "Please Enter the Full name of college."})

        if(!fullNameRegEx.test(data.fullName.trim()))
            return res.status(400).send({
                status: false, 
                msg: "Please Enter a valid college Full Name."})
        
        data.fullName = data.fullName.split(' ').map(x => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()).join(' ')

        if(data.logoLink && !isValid(data.logoLink))
            return res.status(400).send({
                status: false, 
                msg: "Please Enter the URL logoLink."})

        if(data.logoLink && !urlRegEx.test(data.logoLink.trim()))
            return res.status(400).send({
                status: false, 
                msg: "Please Enter a valid URL for the logoLink."})
        
        if(await collegeModel.exists({name:data.name}))
            return res.status(400).send({
                status:false,
                msg: "This college Short Name is taken. College details already exists in our Database."})

        let college = await collegeModel.create(data)
            res.status(201).send({
                status:true,
                data: college})
    }
    catch(err){
        console.log(err.message)
        if(err.message.includes('E11000' && 'name'))
            return res.status(500).send({
                status: false,
                msg: "Please enter a unique college name"})

        if(err.message.includes('E11000' && 'fullName'))
            return res.status(500).send({
                status: false,
                msg: "Please enter a unique college fullName"})
        
        res.status(500).send({status:false, msg: err.message})
    }
}

module.exports = createCollege