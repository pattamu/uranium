const express = require('express');
const router = express.Router();
const controller = require("../controllers/authorController")
const authorLogin = require("../controllers/authentication")
const loginCheck = require("../middleware/authorisation")

//Author-Blog route Hndlers
router.post("/author", controller.createAuthor)
router.post("/blogs", loginCheck, controller.createBlogs)
router.get("/blogs", loginCheck, controller.getBlogs)
router.put("/blogs/:blogId", loginCheck, controller.updateBlogs)
router.delete("/blogs/:blogId", loginCheck, controller.deleteBlogs)
router.delete("/blogs", loginCheck, controller.deleteBlogsQP)

//Authentication route Handlers
router.post("/login", authorLogin)

module.exports = router;

