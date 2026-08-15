const { Router } = require('express');
const router = Router();
const User = require('../models/user');
// const { createHmac } = require('crypto');

// Register a new user
router.get('/signin', (req, res) => {
    res.render('signin');
});
router.get('/signup', (req, res) => {
    res.render('signup');
});
router.post('/signin', async (req, res) => {
    const { Email, Password } = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(Email, Password);
        return res.cookie('token', token).redirect('/');
    } catch (error) {
        return res.render("signin", {
            error: "Incorrect email or password",
        });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie("token").redirect("/")
})


router.post('/signup', async (req, res) => {
    const { Fullname, Email, Password } = req.body;
    await User.create({ Fullname, Email, Password });
    return res.redirect("/");
});


module.exports = router;