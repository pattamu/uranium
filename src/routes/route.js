const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController")
const bookController = require("../controllers/bookController")
const authorBookController = require("../controllers/authorBookController")

//User route handlers
router.post("/createUser", userController.createUser)
router.get("/getUsersData", userController.getUsersData)

//Book route handlers
router.post("/createBook", bookController.createBook)
router.get("/getBooksData", bookController.getBooksData)
router.post("/bookList", bookController.bookList)
router.post("/getBooksInYear", bookController.getBooksInYear)
router.post("/getParticularBooks", bookController.getParticularBooks)
router.get("/getXINRBooks", bookController.getXINRBooks)
router.get("/getRandomBooks", bookController.getRandomBooks)

//Auther & Book route handlers
router.post("/createAuthor", authorBookController.createAuthor)
router.post("/createBook2", authorBookController.createBook) //endpoint is createBook2 because createBook is already present
router.post("/findBooks", authorBookController.findBooks)
router.post("/findUpdate", authorBookController.findUpdate)
router.get("/findRange", authorBookController.findRange)    

module.exports = router;

