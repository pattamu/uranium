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

const loginCheck = async (req, res, next) => {
    try{
        // let authCheck = await author.findOne(req.query)//author should pass email and passsword in the body
        // if(!authCheck) return res.status(401).send({status: false, msg: "No Author Found"})
        let token = req.headers['x-api-key']
        if(!token) return res.status(401).send({status: false, msg: 'Token is required to verify log in credentials. Please send it.'}) 
        let tokenValidity = jwt.verify(token, "Which came first, The Egg or the Chicken ??!")
        req.headers['valid_author'] = tokenValidity.authorId
        // if(tokenValidity.userId !== id) return res.status(401).send({status: false, msg: "This user hasn't been Authorised"}) 
        next()
        }
    catch(err){
        console.log(err.message)
        res.status(401).send({status: false, msg: 'Author never logged in. please log in First'}) 
    }
}
module.exports = {authorLogin, loginCheck}
