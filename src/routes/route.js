const express = require('express');
const router = express.Router();
const controller = require("../controllers/authorController")
const authorLogin = require("../controllers/authentication")
const loginCheck = require("../middleware/authorisation")

//Author-Blog route Handlers
router.post("/author", controller.createAuthor)
router.post("/blogs", loginCheck, controller.createBlogs)
router.get("/blogs", loginCheck, controller.getBlogs)
router.put("/blogs/:blogId", loginCheck, controller.updateBlogs)
router.delete("/blogs/:blogId", loginCheck, controller.deleteBlogs)
router.delete("/blogs", loginCheck, controller.deleteBlogsQP)

//Authentication route Handlers
router.post("/login", authorLogin)

module.exports = router;

//check if the author is logged in or not (common for all apis)

//if logged in then check he's giving his own author id to create blog 

//if logged in then check if is accessing his own blogs only. he should not able to fetch other author's blog

//if logged in then he should only be able to update his own blogs 

//if logged in then he should be able to only delete his own blog only



