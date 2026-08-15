const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); 

const Blog = require("../models/blog")

const router = Router();

const storage = multer.diskStorage({
 destination: function (req, file, cb) {
    const uploadPath = path.resolve(`./public/uplodes/${req.user._id}`);

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
router.post('/',  upload.single('coverImage'), async(req, res) => {
    const { title, body } = req.body;
    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImage: `/uplodes/${req.file.filename}`
    })
    return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;