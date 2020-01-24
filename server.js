const express = require('express');
const app = express();
const path = require('path');

// MULTER BELLOW

const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({storage: storage})
// const mysql = require('mysql')
const db = require('./config/connection')
const PORT = 7000;


// handlebars required 
const exphbs = require('express-handlebars');
// handlebars engine set up
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// connection to public folder
app.use( express.static('public'));
app.use("/assets", express.static('./assets'));

// router for guest
// app.get('/guest', (req, res)=>{
//     res.render('guest', {
//         title: 'GUEST PAGE',
//         style: 'guest.css'     
//     })
// })

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

    // console.log(req.query)

    db.query(`SELECT * from articles WHERE id=${req.query.id}`,
        

        function (error, results, fields) {


            res.set('Content-Type', 'text/html');
            res.render('article', {
                title: results[0].headline,
                style: 'create.css',
                helpers: {
                    headline2: function(){return results[0].headline},
                    subheadline2: function(){return results[0].subheadline},
                    body2: function(){return results[0].body},
                    image2: function(){return 'http://localhost:7000/uploads/' + results[0].image_url}
                }
            })


        if (error) throw error;
      });

    // res.render('article', {
    //     title: 'ARTICLE PAGE',
    //     style: 'article.css'
    // })
})

// create article page
app.get('/create', (req, res)=>{
    res.render('create', {
        title: 'CREATE ARTICLE PAGE',
        style: 'create.css'
    })
});

app.post('/article', upload.single('image'),  (req, res)=>{


    db.query(`INSERT INTO articles (headline, subheadline, body, image_url) VALUES ('${req.body.headline}', '${req.body.subheadline}', '${req.body.body}', '${req.file.originalname}')`,
        

        function (error, results, fields) {

            // console.log(results.insertId)rs

            // res.redirect('http://localhost:7000/article?id=' + results.insertId);
            res.send('http://localhost:7000/article?id=' + results.insertId)

        if (error) throw error;
      });
})


// host running on
app.listen(PORT, ()=>{
    console.log(`SERVER CONNECTED: 7000`);
    
});