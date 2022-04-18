const mySchema = require("../models/schemas")

const createAuthor = async (req, res) => {
    let data= req.body
    let savedData= await mySchema.author.create(data)
    res.send({msg: savedData})
}

const createPublisher = async (req, res) => {
    let data= req.body
    let savedData= await mySchema.publisher.create(data)
    res.send({msg: savedData})
}

const createBook = async (req,res) => {
    let data = req.body
    if(data.author && data.publisher){
        let a_check = await mySchema.author.find({_id: data.author}).select("_id")// find() returns an empty array if nothing is found
        let p_check = await mySchema.publisher.find({_id: data.publisher}).select("_id").lean()//.lean() is not necessery hence can be removed as well. Check internet for more details about .lean()
        if(!a_check.length && !p_check.length) //"!a_check.length" is same as "a_check.length === 0"
            res.send({msg: "Author and Publisher Id fields dosen't match our data, hence invalid"})
        else if(!a_check.length && p_check.length) 
            res.send({msg: "Author Id field dosen't match our data, hence invalid"})
        else if(a_check.length && !p_check.length)
            res.send({msg: "Publisher Id field dosen't match our data, hence invalid"})
        else {
            if(!await mySchema.book.exists(req.body)){ //.exists() returns null is nothing is found
                //console.log(!await bookModel.exists(req.body)) to check what is returns if it has value and if it doesn't have value
                let savedData= await mySchema.book.create(req.body)
                res.send({msg: savedData})
            } else res.send({msg: "This Book already exits in the collection"})
        }
    }
    else if(!data.author && data.publisher) res.send({msg: "You Must input Author ObjectId"})
    else if(data.author && !data.publisher) res.send({msg: "You must input Publisher ObjectId"})
    else res.send({msg: "You must input Author and Publisher objectId in Book Data"})
} 

const findBook = async (req,res) => {
    // let data = await bookModel.find().populate('author').populate('publisher') //this is correct as well
    // let data = await bookModel.find().populate(['author','publisher']) //This is more efficient as we can write all fields in an array
    let data = await mySchema.book.find().populate([
                            //{path:'author', select:'authorName'},
                            {path: 'author', select:{age:0,_id:0, createdAt:0, updatedAt:0, __v:0}},//line 40 doesn't work if we select some keys to not to display
                            //{path:'publisher', select:'name'},
                            {path: 'publisher', select:{_id:0, createdAt:0, updatedAt:0, __v:0}}//line 42 doesn't work if we select some keys to not to display
                            ]).select({_id:0, createdAt:0, updatedAt:0, __v:0})
                            //The above are some ways to filter populated data 
    res.send({msg: data})
}

const updateBook = async (req,res) => {
    // let find_PId = (await publisherModel.findOne({name: req.body.publisher}).select('_id'))._id.valueOf()
    // console.log(find_PId) //The above 55 line will return the value of the object string and we can check that in 57 to get the same result
    // let find_PId = await mySchema.publisher.findOne({name: req.body.publisher}).select('_id')//if we want to get the publisher name from req.body
    let find_PId = await mySchema.publisher.find({name: {$in:['Penguin','HarperCollins']}}).select('_id') //to directly choose between selected publishers
    console.log(find_PId)
    let data = await mySchema.book.updateMany(
                                        {publisher: find_PId},
                                        {$set: {isHardCover: true}}
                                        )
    res.send({msg: data})
}

const updateBookPrice = async (req,res) => {
    let data = await mySchema.book.updateMany(
                                        {rating: {$gt: 3.5}},
                                        {$inc: {price: 10}}
                                        )
    res.send({msg: data})
}

const updateB = async (req,res) => { //This is good method
    // let a_filter = (await authorModel.find({rating: {$gt: 3.5}}).select("_id")).map(x => x._id)//This works as well but no need for the extra map and all
    let a_filter = await mySchema.author.find({rating: {$gt: 3.5}})
    await mySchema.book.updateMany({author: a_filter}, {$inc: {price: 10}})
    let data = await mySchema.book.find({author:a_filter})
    res.send({msg: data})
}

// const updateB = async (req,res) => { //This is using for loop which is not so better when you can directly do it as above method of line 71
//     let a_filter = (await mySchema.author.find({rating: {$gt: 3.5}}).select("_id")).map(x => x._id)
//     for(let i=0; i< a_filter.length; i++){
//         await mySchema.book.updateMany({author: a_filter[i]}, {$inc: {price: 10}})
//     }
//     let data = await mySchema.book.find()
//     res.send({msg: data})
// }

module.exports = {createAuthor, createPublisher, createBook, findBook, updateBook, updateBookPrice, updateB}
