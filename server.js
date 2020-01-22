const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads' });
const mysql = require('mysql')

const PORT = 7000;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "blog"
});

db.connect();





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

// router for REGINSTERATION Page
app.get('/register', (req, res)=>{
    res.render('register', {
        title: 'REGISTERATION PAGE',
        style: 'register.css'     
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
});

app.post('/article', upload.single('image'),  (req, res)=>{
    res.send("hello");
    console.log(req.body);
    console.log(req.file);

    db.query(

        `INSERT INTO articles (headline, subheadline, body) VALUES ('${req.body.headline}', '${req.body.subheadline}', '${req.body.body}')`,
        
        function (error, results, fields) {
        if (error) throw error;
      });
})


// host running on
app.listen(PORT, ()=>{
    console.log(`SERVER CONNECTED: 7000`);
    
});