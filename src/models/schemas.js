const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const jwt = require('jsonwebtoken');

const authorSchema = mongoose.Schema({ 
    fname: { type: String, required: true, trim: true}, 
    lname: {type: String, required: true, trim: true}, 
    title: {type: String, enum: ["Mr", "Mrs", "Miss"], required: true}, 
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        },
        required: [true, "Email required"]
    }, 
    password: {type: String, required: true} 
}, { timestamps: true })

const blogSchema = mongoose.Schema({ 
    title: {type: String, required: true}, 
    body: {type: String, required: true}, 
    authorId: {type: ObjectId, ref: "Author", required: true}, 
    tags: {type: [String]}, 
    category: {type: String, required: true},
    subcategory: {type: [String]},
    isDeleted: {type: Boolean, default: false}, 
    isPublished: {type: Boolean, default: false},
    publishedAt: {type: Date}, 
    deletedAt: {type: Date}
}, { timestamps: true })

const generateAuthToken = (loginData) => {   
    const token = jwt.sign(
                            {authorId:loginData._id,
                            authorName: `${loginData.fname}  ${loginData.lname}` },
                            'Which came first, The Egg or the Chicken ??!')
    // res.setHeader("x-api-key", token)
    // res.status(200).send({status: true, data: "Token Successfully sent to Header."});
    return token
}

/*in authentication.js if line 10 is used then uncomment this below function & line 67 to generate token 
and comment above function from line 38-46 & line 66*/

// authorSchema.methods.generateAuthToken = async function() {
//     const User = this    
//     const token = jwt.sign({authorId:User._id, 
//                             authorName: `${User.fname}  ${User.lname}` },
//                             'Which came first, The Egg or the Chicken ??!')
//     return token
// }

const decodeAuthToken = (token) => {   
    return tokenValidity = jwt.verify(token, "Which came first, The Egg or the Chicken ??!")
}

const author = mongoose.model('Author', authorSchema) //authors
const blog = mongoose.model('Blog', blogSchema) //blogs

module.exports = {author, blog, generateAuthToken, decodeAuthToken}
// module.exports = {author, blog, decodeAuthToken}

