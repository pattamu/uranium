const {author, blog} = require("../models/schemas")
const mongoose = require("mongoose")

const createAuthor = async (req,res) => {
    try{
        /*************************************VALIDATION*******************************************/
        let data = req.body
        if(!Object.keys(data).length) 
            return res.status(400).send({status: false, msg: "You must enter data."})
        
        if(!data.fname.trim().match(/^[a-zA-Z]+$/)) // REGEX using .match() --> we can check Object Id using this REGEX as well
            return res.status(400).send({status: false, msg: "Enter a valid First name."})
        
        if(!(/^[a-zA-Z]+$/.test(data.lname.trim()))) // REGEX using .test()
            return res.status(400).send({status: false, msg: "Enter a valid Last name."})

        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email.trim())))
            return res.status(400).send({status: false, msg: "Enter a valid email address."})
        /*******************************************************************************************/
        let created = await author.create(data)
        res.status(201).send({status: true, data: created})
    }
    catch(err){
        console.log(err.message)
        res.status(500).send({status: false, msg: err.message})
    }
}

const createBlogs = async (req,res) => {
    try{
        /*********************************VALIDATION*********************************/
        let data = req.body
        if(!Object.keys(data).length) 
            return res.status(400).send({status: false, msg: "You must enter data."})
        if(!mongoose.isValidObjectId(data.authorId))
        // if(!data.authorId.match(checkForHexRegExp = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i))//can check ObjectId using this REGEX as well
            return res.send({status: false, msg: "Please enter a valid Author ObjectId."})
        /****************************Authentication Check******************************/
        if(req.headers['valid_author'] != data.authorId)
            return res.status(401).send({status: false, msg: "Enter your own AuthorId."})
        /*******************************************************************************/
        data.tags = [...new Set(data.tags)]
        data.subcategory = [...new Set(data.subcategory)]
        if(data.isPublished){
            data.publishedAt = Date.now()
        }
        if(data.isDeleted){
            data.deletedAt = Date.now()
        }
        if(!await author.findById(req.body.authorId)) 
            return res.status(400).send({status: false, msg: "AuthorId is not valid"})
        let created = await blog.create(data)
        res.status(201).send({status: true, data: created})
    }
    catch(err){
        console.log(err.message)
        res.status(500).send({status: false, msg: err.message})
    }
}

const getBlogs = async (req,res) => {
    try{
        if(req.query.title && !req.query.body) delete req.query.title
        else if(req.query.body && !req.query.title) delete req.query.body
        else if(req.query.title && req.query.body){
            delete req.query.title
            delete req.query.body
        }
        // if(!Object.keys(req.query).length)//suppose it's asked that no blogs should be displyed in case no filter is applied, then use 64 &65 line
        //     return res.status(400).send({status: false, msg: "No filters applied or apply filters apart from 'title' and 'body'."})
        if(!Object.keys(req.query).length) {
            let filter = await blog.find({isDeleted: false, isPublished: true})
            return res.status(200).send({status: true, data: filter})
        }
        req.query.isDeleted = false
        req.query.isPublished = true
        let filter = await blog.find({$and: [req.query,{authorId: req.headers['Author-login']}]})//<---Authorization--->
        // let filter = (await blog.find(req.query)).filter(x => x.authorId == req.headers['valid_author'])//<---Authorization--->
        // line 78 - we can also use filter to get all blog datas of the logged in user
        if(!filter.length)
            return res.status(404).send({status: false, msg: "No such documents found"})
        res.status(200).send({status: true, data: filter})
    }
    catch(err){
        console.log(err.message)
        res.status(500).send({status: false, msg: err.message})
    }
}

const updateBlogs = async (req,res) => {
    try{
        /*************************************VALIDATION**************************************/
        if(!Object.keys(req.body).length) 
            return res.status(400).send({status: false, msg: "No data provided to update."})
        if(!mongoose.isValidObjectId(req.params.blogId))
        // if(!req.params.blogId.match(checkForHexRegExp = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i))//can also check ObjectId validation using RegEx
            return res.status(400).send({status: false, msg: "Send a valid Blog ObjectId in params."})
        let findBlog = await blog.findOne({_id:req.params.blogId, isDeleted: false})
        if(!findBlog)
            return res.status(404).send({status: false, msg: "No such documents found"})
        /******************************Authentication Check*****************************/
        if(req.headers['valid_author'] != findBlog.authorId)
            return res.status(401).send({status: false, msg: "You don't have permission to update this Blog."})
        /*********************************************************************************/
        let {title, body, tags, subcategory} = req.body
        let updatedblog = await blog.findOneAndUpdate({_id: req.params.blogId, isDeleted: false},
                                                    // {$push: {tags: tags, subcategory:subcategory},//$push will push the element to array
                                                    {$addToSet: {tags: {$each:tags||[]},subcategory:{$each:subcategory||[]}},
                                                    //$set will push only unique elements and won't push element if already exists
                                                    title: title, body: body,
                                                    publishedAt: Date.now(),
                                                    isPublished: true},
                                                    {new: true})
        res.status(200).send({status: true, data: updatedblog})
    }
    catch(err){
        console.log(err.message)
        res.status(500).send({status: false, msg: err.message})
    }
}

const deleteBlogs = async (req,res) => {
    try{
        /*************************************VALIDATION*******************************************/
        if(!mongoose.isValidObjectId(req.params.blogId))
        // if(!req.params.blogId.match(checkForHexRegExp = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i))//Can also check Object Id Validation using REGEX 
            return res.status(400).send({status: false, msg: "Send a valid Blog ObjectId in params."})
        /******************************Authentication Check*****************************/
        let authCheck = await blog.findById(req.params.blogId)
        if(authCheck.authorId != req.headers['valid_author'])
            return res.status(401).send({status: false, msg: "You don't have authority to delete this Blog."})
        /*********************************************************************************/
        if(!await blog.findOneAndUpdate({_id:req.params.blogId, isDeleted: false},{isDeleted: true}))
            return res.status(404).send({status: false,data: "No document found"})
        res.status(200).end()
    }
    catch(err){
        console.log(err.message)
        res.status(500).send({status: false, msg: err.message})
    }
}

const deleteBlogsQP = async (req,res) => {
    try{
        /****************************VALIDATION*************************/
        if(!Object.keys(req.query).length) 
            return res.status(400).send({status: false, msg: "Please select some filters for deletion."})
        /******************************Authentication Check*****************************/
        // req.query.isPublished = false
        let findBlogs = await blog.find({$and: [req.query,{authorId: req.headers['Author-login']},{isPublished: false}]})//<---Authorization--->
        // let findBlogs = (await blog.find(req.query)).filter(x => x.authorId == req.headers['valid_author'])
        // line 143 - we can also use filter to get all blog datas of the logged in user
        if(!findBlogs.length) return res.status(404).send({status: false, msg: "No document found"})
        /*********************************************************************************/
        let blogs = await blog.updateMany({_id:findBlogs},{$set:{isDeleted: true}})
        if(blogs.matchedCount == 0)
            return res.status(404).send({status: false,data: "No document found"})
        let blogData = await blog.find({_id:findBlogs, isDeleted: true, isPublished: false})
        res.status(200).send({status:true, msg: blogData})
    }
    catch(err){
        console.log(err.message)
        res.status(500).send({status: false, msg: err.message})
    }
}

/**********************The below code can be used when authentication is not needed*********************/

//deleteblogs by queryParams by Sandeep
// const deleteBlogsQP = async (req,res) => {
//     try{
//         req.query.isPublished = false
//         let blogs = await blog.updateMany(req.query,{$set:{isDeleted: true}})
//         if(blogs.matchedCount == 0)
//         return res.status(404).send({status: false,data: "No document found"})
//         req.query.isDeleted = true
//         let blogData = await blog.find(req.query)
//         res.status(200).send({status:true, msg: blogData})
//     }
//     catch(err){
//         console.log(err.message)
//         res.status(500).send({status: false, msg: err.message})
//     }
// }

module.exports = {createAuthor, createBlogs, getBlogs, updateBlogs, deleteBlogs, deleteBlogsQP}
