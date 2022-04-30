const jwt = require('jsonwebtoken')

const loginCheck = async (req, res, next) => {
    try{
        let token = req.headers['x-api-key']
        if(!token) 
            return res.status(401).send({status: false, msg: 'Token is required to verify log in credentials. Please send it.'}) 
        let tokenValidity = jwt.verify(token, "Which came first, The Egg or the Chicken ??!")
        req.headers['valid_author'] = tokenValidity.authorId
        next()
        }
    catch(err){
        console.log(err.message)
        res.status(401).send({status: false, msg: 'Author never logged in. please log in First'}) 
    }
}
module.exports = loginCheck