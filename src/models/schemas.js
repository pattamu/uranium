const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const authorSchema = new mongoose.Schema({
    authorName: String,
	age: Number,
	address: String,
    rating: Number
    }, { timestamps: true });

const publisherSchema = new mongoose.Schema({
    name: String,
    headQuarter: String
    }, { timestamps: true });

const bookSchema = new mongoose.Schema({
    name: {type: String, required:true},
    author: {type: ObjectId, ref: 'Author1'},
    price: Number,
    rating: Number,
    isHardCover: {type: Boolean, default: false},
    publisher: {type: ObjectId, ref: 'Publisher1'}
    }, { timestamps: true });
    
const author = mongoose.model('Author1', authorSchema) //author1
const publisher = mongoose.model('Publisher1', publisherSchema) //publisher1
const book = mongoose.model('Book1', bookSchema) //book1

module.exports = {author, publisher, book}

