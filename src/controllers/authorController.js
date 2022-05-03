const {author, blog} = require("../models/schemas")
const mongoose = require("mongoose")

const createAuthor = async (req,res) => {
    try{
        /************************************VALIDATION***************************************/
        let data = req.body
        if(!Object.keys(data).length) 
            return res.status(400).send({status: false, msg: "You must enter data."})
        
        if(!data.fname.trim().match(/^[a-zA-Z]+$/)) // REGEX using .match() --> we can check Object Id using this REGEX as well
            return res.status(400).send({status: false, msg: "Enter a valid First name."})
        
        if(!(/^[a-zA-Z]+$/.test(data.lname.trim()))) // REGEX using .test()
            return res.status(400).send({status: false, msg: "Enter a valid Last name."})

        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email.trim())))
            return res.status(400).send({status: false, msg: "Enter a valid email address."})
        /***************************************************************************************/
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
        /*****************************************VALIDATION***********************************************/
        console.log(req.userId)
        let data = req.body
        if(!Object.keys(data).length) 
            return res.status(400).send({status: false, msg: "You must enter data to create a Blog."})
        if(!data.title)
            return res.status(400).send({status: false, msg: "Title must be present."})
        if(!data.body)
            return res.status(400).send({status: false, msg: "Body must be present."})
        if(!data.authorId)
            return res.status(400).send({status: false, msg: "AuthorId must be present."})
        if(!data.category)
            return res.status(400).send({status: false, msg: "Category must be present."})
        if(!mongoose.isValidObjectId(data.authorId))
        // if(!data.authorId.match(checkForHexRegExp = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i))
        // we can check ObjectId using this REGEX as well which is shown in line 46. comment line 45 and uncomment line 46 to check.
            return res.status(400).send({status: false, msg: "Invalid Author ObjectId."})
        if(!await author.findById(req.body.authorId)) 
            return res.status(400).send({status: false, msg: "AuthorId doesn't present in our DB."})
        if(req.body.tags.some(x => x.match(/[^_a-zA-Z]/)))
            return res.status(400).send({status:false, msg: "INVALID!! Tag can't contain spaces/numbers/special_characters."})
        if(req.body.subcategory.some(x => x.match(/[^_a-zA-Z]/)))
            return res.status(400).send({status:false, msg: "INVALID!! Subcategory can't contain spaces/numbers/special_characters."})
        /*****************************************Authentication Check*******************************************/
        if(req.headers['valid_author'] != data.authorId)
            return res.status(401).send({status: false, msg: "Enter your own AuthorId to create a blog."})
        /*******************************************************************************************************/
        data.tags = [...new Set(data.tags)]
        data.subcategory = [...new Set(data.subcategory)]
        if(data.isPublished)
            data.publishedAt = Date.now()
        
        if(await blog.exists(data)) 
            return res.status(400).send({status: false, msg: "Blog already present"})
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
        let tags; let subcategory;
        if(req.query.tags)
            tags = (req.query.tags.split(/[, '"+-;]+/)).map(x => x.trim()).map(x => {return {tags:x}})
        if(req.query.subcategory)
            subcategory = (req.query.subcategory.split(/[, '"+-;]+/)).map(x => x.trim()).map(x => {return {subcategory:x}})
        //---> REGEX --> '/[, ]+/' --> this will split the string by space as well as comma
        //---> REGEX --> '/[, '"+-;]+/' --> this will split the string by space,comma and aslo (' " + - ;)

        let total = [...tags||[],...subcategory||[],{title:req.query.title||''},{body:req.query.body||''}, 
                    {authorId:req.query.authorId||null},{category:req.query.category||''}]
        console.log(total)
        if(!Object.keys(req.query).length){
            let blogs = await blog.find({isDeleted: false, isPublished: true},{createdAt:0,updatedAt:0,__v:0})
            return res.status(200).send({status:true, data:blogs})
        }
        let blogs = await blog.find({$or:total, isDeleted: false, isPublished: true},{createdAt:0,updatedAt:0,__v:0})
        if(!blogs.length)
            return res.status(404).send({status: false, msg: "No such documents found"})
        res.status(200).send({status: true, data: blogs})
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
            return res.status(400).send({status: false, msg: "Invalid Blog ObjectId."})
        let findBlog = await blog.findOne({_id:req.params.blogId, isDeleted: false})
        if(!findBlog)
            return res.status(404).send({status: false, msg: "No documents found to update."})
        /***********************************Authentication Check**********************************/
        if(req.headers['valid_author'] != findBlog.authorId)
            return res.status(401).send({status: false, msg: "You don't have permission to update this Blog."})
        /*****************************************************************************************/
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
            return res.status(400).send({status: false, msg: "Invalid Blog ObjectId."})
        /************************************Authentication Check***********************************/
        let authCheck = await blog.findById(req.params.blogId)
        if(authCheck.authorId != req.headers['valid_author'])
            return res.status(401).send({status: false, msg: "You don't have authority to delete this Blog."})
        /********************************************************************************************/
        if(!await blog.findOneAndUpdate({_id:req.params.blogId, isDeleted: false},{isDeleted: true, deletedAt: Date.now()}))
            return res.status(404).send({status: false,data: "No documents found to delete."})
        res.status(200).end()
    }
    catch(err){
        console.log(err.message)
        res.status(500).send({status: false, msg: err.message})
    }
}


const deleteBlogsQP = async (req,res) => {
    try{
        /***********************************VALIDATION****************************************/
        if(!Object.keys(req.query).length) 
            return res.status(400).send({status: false, msg: "Please select some filters for deletion."})
        /**********************************Authorization Check********************************/
        delete req.query.authorId
        let id = req.headers['valid_author']
        let tags; let subcategory;

        if(req.query.tags)
            tags = (req.query.tags.split(/[, '"+-;]+/)).map(x => x.trim()).map(x => {return {tags:x}})
        if(req.query.subcategory)
            subcategory = (req.query.subcategory.split(/[, '"+-;]+/)).map(x => x.trim()).map(x => {return {subcategory:x}})

        let filter = [...tags||[],...subcategory||[],{title:req.query.title||''},{body:req.query.body||''}
                        ,{category:req.query.category||''}]
        /****************************************************************************************/
        let blogs = await blog.updateMany({$or:filter, authorId:id, isDeleted:false, isPublished:false},
                                            {isDeleted:true, deletedAt: Date.now()})
        if(blogs.matchedCount == 0) 
            return res.status(404).send({status:false, data: "No documents found."})
        res.status(200).send({status: true, data: `Total deleted document count: ${blogs.modifiedCount}`});
    }
    catch(err){
        console.log(err)
        res.status(500).send({status:false, msg: err.message})
    }
}


module.exports = {createAuthor, createBlogs, getBlogs, updateBlogs, deleteBlogs, deleteBlogsQP}
