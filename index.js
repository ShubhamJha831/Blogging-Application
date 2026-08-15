const path = require('path');
const express = require('express');
const userRoutes = require('./route/user');
const blogRoutes = require('./route/blog')
const mongoose = require('mongoose');
const cookiePaser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');


const app = express();
const PORT = 3000;
mongoose.connect('mongodb://localhost:27017/blogverse').then(e => console.log("Connected to MongoDB"));

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookiePaser());
app.use(checkForAuthenticationCookie("token")); 


app.get('/', (req, res) => {
    res.render('home', {
        user: req.user, 
    });
}); 
app.use('/user', userRoutes);
app.use('/blog', blogRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on:  ${PORT}`);
})