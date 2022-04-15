const bookModel = require("../models/bookModel")
const authorModel = require("../models/authorModel")
const publisherModel = require("../models/publisherModel")

const createAuthor = async (req, res) => {
    let data= req.body
    let savedData= await authorModel.create(data)
    res.send({msg: savedData})
}

const createPublisher = async (req, res) => {
    let data= req.body
    let savedData= await publisherModel.create(data)
    res.send({msg: savedData})
}

const createBook = async (req,res) => {
    let data = req.body
    let a_check = await authorModel.find({_id: data.author}).select("_id")// find() returns an empty array if nothing is found
    let p_check = await publisherModel.find({_id: data.publisher}).select("_id").lean() //.lean() is no necessery hence can be removed as well. Check internet for more details about .lean()
    if(!a_check.length && !p_check.length) //"!a_check.length" is same as "a_check.length === 0"
        res.send({msg: "Author and Publisher Id fields don't match our data, hence invalid"})
    else if(!a_check.length && p_check.length) 
        res.send({msg: "Author Id field dosen't match our data, hence invalid"})
    else if(a_check.length && !p_check.length)
        res.send({msg: "Publisher Id field dosen't match our data, hence invalid"})
    else {
        if(!await bookModel.exists(req.body)){ //.exists() returns null is nothing is found
            //console.log(!await bookModel.exists(req.body)) to check what is returns if it has value and if it doesn't have value
            let savedData= await bookModel.create(req.body)
            res.send({msg: savedData})
        } else res.send({msg: "This Book already exits in the collection"})
    }
} 

const findBook = async (req,res) => {
    // let data = await bookModel.find().populate('author').populate('publisher') //this is correct as well
    // let data = await bookModel.find().populate(['author','publisher']) //This is more efficient as we can write all fields in an array
    let data = await bookModel.find().populate([
                                            //{path:'author', select:'authorName'},
                                            {path: 'author', select:{age:0,_id:0, createdAt:0, updatedAt:0, __v:0}},//line 40 doesn't work if we select some keys to not to display
                                            //{path:'publisher', select:'name'},
                                            {path: 'publisher', select:{_id:0, createdAt:0, updatedAt:0, __v:0}}//line 42 doesn't work if we select some keys to not to display
                                        ]).select({_id:0, createdAt:0, updatedAt:0, __v:0})
                                        //The above is some ways to filter populated data 
    res.send({msg: data})
}

module.exports = {createAuthor, createPublisher, createBook, findBook}
