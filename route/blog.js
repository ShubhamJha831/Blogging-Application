const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); 

const Blog = require("../models/blog")
const Comment = require("../models/comment")

const router = Router();

const storage = multer.diskStorage({
 destination: function (req, file, cb) {
    const uploadPath = path.resolve(`./public/uploads/uplodes/${req.user._id}`);

    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
},
  filename: function (req, file, cb) {
   const fileName = `${Date.now()}-${file.originalname}`
   cb(null, fileName)
  }
});

const upload = multer({ storage: storage })

router.get('/add-new', (req, res) => {
    return res.render ('addBlog', {
        user: req.user,
    });
});

router.get('/:id', async (req, res) => {

    console.log("ID:", req.params.id);

    const blog = await Blog.findById(req.params.id);
    const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy")

    console.log("BLOG BEFORE POPULATE:", blog);

    const populatedBlog = await Blog.findById(req.params.id)
        .populate('createdBy');

    console.log("BLOG AFTER POPULATE:", populatedBlog);
    
    console.log("comments", comments );

    return res.render("blog", {
        user: req.user,
        blog: populatedBlog,
        comments,
    });
});

router.post('/comment/:blogId', async(req, res) => {
    await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    });

    return res.redirect(`/blog/${req.params.blogId}`);
});


router.post('/', upload.single('coverImage'), async(req, res) => {
    const { title, body } = req.body;
    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageURL: `/uploads/uplodes/${req.user._id}/${req.file.filename}`
    })
    return res.redirect('/');
    //return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;