const express = require('express');
const app = express();
const path = require('path');
const PORT = 7000;

// handlebars required 
const exphbs = require('express-handlebars');
// handlebars engine set up
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// connection to public folder
app.use(express.static('public'));

// router for loginPage
app.get('/login', (req, res)=>{
    res.render('loginPage', {
        title: 'LOGIN PAGE',
        style: 'login.css'     
    })
})

// router for Home Page
app.get('/home', (req, res)=>{
    res.render('home', {
        title: 'HOME PAGE',
        style: 'home.css'
    })
})

// router for article Page
app.get('/article', (req, res)=>{
    res.render('article', {
        title: 'ARTICLE PAGE',
        style: 'article.css'
    })
})

// create article page
app.get('/create', (req, res)=>{
    res.render('create', {
        title: 'CREATE ARTICLE PAGE',
        style: 'create.css'
    })
})


// host running on
app.listen(PORT, ()=>{
    console.log(`SERVER CONNECTED: 7000`);
    
});