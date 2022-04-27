const {author, blog} = require("../models/schemas")

//createAuthor API by Sandeep
const createAuthor = async (req,res) => {
    try{
        let data = req.body
        let created = await author.create(data)
        res.status(201).send({status: true, data: created})
    }
    catch(err){
        console.log(err.message)
        res.status(500).send({status: false, msg: err.message})
    }
}

//createBlog API by Sandeep
const createBlogs = async (req,res) => {
    try{
        let data = req.body
        /**********************Authentication Check************************/
        if(req.headers['valid_author'] != data.authorId)
        return res.status(401).send({status: false, msg: "Enter your own AuthorId."})
        /****************************************************************************/
        if(!await author.findById(req.body.authorId)) 
        return res.status(208).send({status: false, msg: "AuthorId is not valid"})
        let created = await blog.create(data)
        res.status(201).send({status: true, data: created})
    }
    catch(err){
        console.log(err.message)
        res.status(500).send({status: false, msg: err.message})
    }
}

//getBlog API by Sandeep
const getBlogs = async (req,res) => {
    try{
        if(!req.query) return res.status(404).send({status:false, msg: "Filter condition is empty."})
        req.query.isDeleted = false
        req.query.isPublished = true
        let filter = (await blog.find(req.query)).filter(x => x.authorId == req.headers['valid_author'])
        //line 40 - filter is used to get all blog datas of the logged in user only
        if(!filter.length)
        return res.status(404).send({status: false, msg: "No such documents found"})
        res.status(200).send({status: true, data: filter})
    }
    catch(err){
        console.log(err.message)
        res.status(500).send({status: false, msg: err.message})
    }
}

//updateBlogs API by Sandeep
const updateBlogs = async (req,res) => {
    try{
        if(!req.body) return res.status(406).send({status: false, msg: "No data provided to update."})
        let findBlog = await blog.findOne({_id:req.params.blogId, isDeleted: false})
        if(!findBlog)
        return res.status(404).send({status: false, msg: "No such documents found"})
        /******************************Authentication Check*****************************/
        if(req.headers['valid_author'] != findBlog.authorId)
        return res.status(401).send({status: false, msg: "You can't update this Blog."})
        /*********************************************************************************/
        let {title, body, tags, subcategory} = req.body
        let updatedblog = await blog.findOneAndUpdate({_id: req.params.blogId},
                                                    {$push: {tags: tags, subcategory:subcategory},
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

//deleteblogs by paramId by Sandeep
const deleteBlogs = async (req,res) => {
    try{
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
        /******************************Authentication Check*****************************/
        req.query.isPublished = false
        let findBlogs = (await blog.find(req.query)).filter(x => x.authorId == req.headers['valid_author'])
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

/**********************The below code can be used without authentication*********************/

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
