const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const internSchema = mongoose.Schema({ 
    name: {
        type: String,
        required:true, 
        trim: true
    }, 
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, "Email is required."]
    }, 
    mobile: {
        type: String,
        unique: true,
        required: [true, "Mobile Number is required."]
    },
    collegeId: {
        type:ObjectId,
        ref: "College"
    },
    isDeleted: {
        type: Boolean, 
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('Intern', internSchema) //interns