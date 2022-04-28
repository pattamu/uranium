const jwt = require('jsonwebtoken')
const {author, blog} = require("../models/schemas")

const authorLogin = async (req, res) => {
    try{
        let data = req.body
        let authorData = await author.findOne({email:data.email, password: data.password})
        if(authorData){
        let token = jwt.sign({authorId: authorData._id.toString(), fname: authorData.fname}, 
                            "Which came first, The Egg or the Chicken ??!")
        res.setHeader("x-api-key", token)
        res.status(202).send({status: true, data: token})
        }
        else res.status(404).send({status: false, msg: "This Author credentials don't exist in our DB."})
    }catch (err) {
        res.status(500).send({status: false, msg: err.message})
    }
}

module.exports = authorLogin
