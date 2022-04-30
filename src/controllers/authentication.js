// const jwt = require('jsonwebtoken')
const {author, generateAuthToken} = require("../models/schemas")

const authorLogin = async(req, res) => {
    try{
        if(Object.keys(req.body).length <= 1) 
            return res.status(400).send({status: false, msg: "Must enter email and password."})
        const authorData = await author.findOne({email:req.body.email,password:req.body.password});
        if(authorData){
            let token = generateAuthToken(authorData)
            // const token = await authorData.generateAuthToken();//this can be used instead of line 10 to generate token
            res.setHeader("x-api-key", token)
            res.status(200).send({status: true, data: "Token Successfully sent to Header."});
        }
        else {
            res.status(400).send({status:400,message:"Invalid Credentials"});
        }
    }catch(error) {
        console.log(error);
        res.status(400).send("invalid login Detailes")
    }
}

/**The below api generates token directly without calling a function******************/

// const authorLogin = async (req, res) => {
//     try{
//         let data = req.body
//         if(Object.keys(data).length <= 1) 
//             return res.status(400).send({status: false, msg: "Must enter email and password."})
//         let authorData = await author.findOne({email:data.email, password: data.password})
//         if(authorData){
//         let token = jwt.sign(
//                             {authorId: authorData._id.toString(),
//                             fname: authorData.fname,
//                             lname: authorData.lname}, 
//                             "Which came first, The Egg or the Chicken ??!")
//         res.setHeader("x-api-key", token)
//         res.status(202).send({status: true, data: "Token Successfully sent to Header."})
//         }
//         else res.status(404).send({status: false, msg: "This Author credentials don't exist in our DB."})
//     }catch (err) {
//         res.status(500).send({status: false, msg: err.message})
//     }
// }

module.exports = authorLogin
