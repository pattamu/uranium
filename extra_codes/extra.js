// const { default: mongoose } = require("mongoose")
// const {author, blog} = require("../models/schemas")

// const extra = async (req,res) => {
//     try{
//         console.log(req.query)
//         let temp = await blog.find()
//         if(req.query.tags)  {
//             req.query.tags = req.query.tags.split(',')//.trim()
//             req.query.tags = req.query.tags.map(x => x.trim())
//             // let res = arr1.filter(item => arr2.includes(item));
//             let tags = []
//             for(let i in temp){
//                 req.query.tags.forEach(x => {
//                     if(temp[i].tags.includes(x))
//                     tags.push(x)})
//             }
//             req.query.tags = [...new Set(tags)].map(x => {return {tags:x}})
//         }
//         if(req.query.subcategory)  {
//             req.query.subcategory = req.query.subcategory.split(',')
//             req.query.subcategory = req.query.subcategory.map(x => x.trim())
//             let subcategory = []
//             for(let i in temp){
//                 req.query.subcategory.forEach(x => {
//                     if(temp[i].subcategory.includes(x))
//                     subcategory.push(x)})
//             }
//             req.query.subcategory = [...new Set(subcategory)].map(x => {return {subcategory:x}})
//         }
//         console.log(req.query)
//         // if(req.query.tags)
//         // if(!req.query.tags.length) delete req.query.tags
//         // // if(!req.query.subcategory.length) delete req.query.subcategory
//         // if(!temp.some(x => x.title == req.query.title)) delete req.query.title
//         // if(!temp.some(x => x.body == req.query.body)) delete req.query.body
//         // if(!temp.some(x => x.authorId == req.query.authorId)) delete req.query.authorId
//         // if(!temp.some(x => x.category == req.query.category)) delete req.query.category
//         /**************************************Authentication Check***********************************/
//         // let filter = [{tags: req.query.tags},{subcategory:req.query.subcategory}]
//         let findBlogs = await blog.find({$or:req.query.tags})
//             res.send({data: findBlogs})
//     }
//     catch(err){
//         console.log(err)
//         res.status(500).send({status: false, msg: err.message})
//     }
// }

// module.exports = extra