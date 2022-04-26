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
// const createBlogs = async (req,res) => {
//     try{
//         let data = req.body
//         if(!await author.findById(req.body.authorId)) 
//         return res.status(208).send({status: false, msg: "AuthorId is not valid"})
//         if(await blog.exists(data)) 
//         return res.status(208).send({status: false, msg: "Blog already present"})
//         let created = await blog.create(data)
//         res.status(201).send({status: true, data: created})
//     }
//     catch(err){
//         console.log(err.message)
//         res.status(500).send({status: false, msg: err.message})
//     }
// }

//getBlog API by Sandeep
const getBlogs = async (req,res) => {
    try{
        req.query.isDeleted = false
        req.query.isPublished = true
        let filter = await blog.find(req.query)
        if(!filter.length)
        return res.status(404).send({status: false, msg: "No such documents found"})
        res.status(200).send({status: true, data: filter})
    }
    catch(err){
        console.log(err.message)
        res.status(500).send({status: false, msg: err.message})
    }
}

module.exports = {createAuthor, getBlogs}

// updateBlogs, deleteBlogs, deleteBlogsQP