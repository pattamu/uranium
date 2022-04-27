const express = require('express');
const router = express.Router();
const controller = require("../controllers/authorController")
const {authorLogin, loginCheck} = require("../authentication/authentication")

//Author-Blog route Hndlers
router.post("/author", controller.createAuthor)
router.post("/blogs", loginCheck, controller.createBlogs)
router.get("/blogs", loginCheck, controller.getBlogs)
router.put("/blogs/:blogId", loginCheck, controller.updateBlogs)
router.delete("/blogs/:blogId", loginCheck, controller.deleteBlogs)
router.delete("/blogs", loginCheck, controller.deleteBlogsQP)
router.post("/login", authorLogin)

module.exports = router;

