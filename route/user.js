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

  const user = await User.matchPassword(Email, Password);

    console.log("User", user);
    return res.redirect('/');
    // try {
    //     const user = await User.matchPassword(Email, Password);
    //     return res.redirect('/user/dashboard');
    // } catch (error) {
    //     return res.status(400).send(error.message);
    // }
});
router.post('/signup', async (req, res) => {
    const { Fullname, Email, Password } = req.body;
    await User.create({ Fullname, Email, Password });
    return res.redirect("/");
});


module.exports = router;