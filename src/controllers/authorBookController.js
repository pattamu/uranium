const authorModel = require("../models/authorModels")
const authorBookModel = require("../models/authorBookModels")

const createAuthor = async (req, res) => {
    let data= req.body
    let savedData= await authorModel.create(data)
    res.send({msg: savedData})
}

const createBook = async (req, res) => {
    let data= req.body
    let savedData= await authorBookModel.create(data)
    res.send({msg: savedData})
}

const findBooks = async (req, res) => {
    let a_id= await authorModel.find({author_name:req.body.author_name})//find returns an array
    console.log(a_id)
    let data= await authorBookModel.find({author_id: a_id[0].author_id}).select({name: 1, _id: 0})
    res.send({msg: data})
}

const findUpdate = async (req, res) => {
    let a_id= await authorBookModel.findOneAndUpdate({name:req.body.name},{$set:{price:150}},{new:true})//findOneAndUpdate returns an object
    console.log(a_id)
    let data= await authorModel.find({author_id: a_id.author_id}).select({author_name: 1, _id: 0})
    console.log(data)
    res.send({msg: {author_name: data[0].author_name, price: a_id.price}})
}

const findRange = async (req,res) => {
    let data = (await authorBookModel.find({price:{$gte:50, $lte:200}}).select({author_id:1, _id:0})).map(x => x.author_id)
    let newData = data.filter((item, index) => data.indexOf(item) === index)
    let a_name = []
    for(let i in newData){
        a_name.push(...await authorModel.find({author_id: newData[i]}).select({ author_name :1, _id:0})) //... is used bcz otherwise find() will return an array of elements
    }
    console.log(a_name)
    res.send({msg: a_name}) //if ... is not used in line 36then you can use a_name.flat() for same result
}

module.exports = {createAuthor, createBook, findBooks, findUpdate, findRange}
