const express = require('express');
const app = express();
const path = require('path');
const userDao = require("./domain/userDao");
const bodyParser = require('body-parser');
app.use(bodyParser.json());

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

const upload = multer({storage: storage});
const PORT = 7000;

// handlebars required 
const exphbs = require('express-handlebars');
// handlebars engine set up
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// connection to public folder
app.use( express.static('public'));
app.use("/assets", express.static('./assets'));

// mysql database connection 
const mysql = require ('mysql');
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "blog"
});
db.connect();

// ROUTER STARTS HERE
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
});
//once click register submit button 
app.post('/signup', async (req, res)=>{
    console.log(req.body);
    //req.body =  {username: victor, email: 09pve09@gmail.com, password: mypassword123}
    //check if user already exists
    const userAlreadyExists = await userDao.existsByUsernameOrEmail(req.body.userName, req.body.email);
    if(userAlreadyExists) res.send({"status": "FAIL", "description": "User already exists"});
    //check if the password == repeatPassword
    if(req.body.password != req.body.passwordRepeat) res.send({"status": "FAIL", "description": "Entered passwords don't match. Try again."});
    //save user to db
    userDao.createUser(req.body);
    const response = {"status":"OK", "description": "Successfully registered the user"}
    res.send(response);
})

app.post('/login', async (req, res)=>{
    // req = { "userName": Vasya, "password": "mypassword123"}
    // Check if the user exists by userName in the DB
    const user = await userDao.getUserByUsername(req.body.userName);
    if(user.length < 1 || user[0].password != req.body.password) {
        //If doesn't exist or password doesn't match throw unauthorized exception
        res.send({"status": "FAIL", "description": "Wrong username or password"});
    }
    //else send user JWT token
    const jwtToken = "rwqrwpoerjpo43534534"
    const response = {"status":"OK", "description": "User successfully logged in", "payload": { "token": jwtToken}}
    res.send(response);
})





// router for Home Page
app.get('/home', (req, res)=>{
    
    db.query(`SELECT * from articles`,
        
    function (error, results, fields) {

        let documents = results.length ? results.map(item => {
            return {...item}
        }) : []

        res.set('Content-Type', 'text/html');
        res.render('home', {
            title: 'Home',
            style: 'create.css',
            helpers: {
                articles: function(){return documents.map(item => {
                    item.body = item.body.substr(0, 350) + '...';
                    return item
                })}
            }
        })

        if (error) throw error;
    }); 
})

// router for article Page
app.get('/article', (req, res)=>{

    // console.log(req.query)

    if(req.query.id){

        db.query(`SELECT * from articles WHERE id=${req.query.id}`,
        
            function (error, articles, fields) {

                db.query(`SELECT * from comments WHERE article_id=${req.query.id}`, function(error, comments, fields){

                    res.set('Content-Type', 'text/html');
                    res.render('article', {
                        title: articles[0].headline,
                        style: 'create.css',
                        helpers: {
                            headline2: function(){return articles[0].headline},
                            subheadline2: function(){return articles[0].subheadline},
                            body2: function(){return articles[0].body},
                            id: function(){return articles[0].id},
                            image2: function(){return 'http://localhost:7000/uploads/' + articles[0].image_url},
                            comments: function(){return comments.map(item => {
                                return {...item}
                            })}
                        }
                    })
    
                    if (error) throw error;
                });

                if (error) throw error;
            });        
    }else{
        res.redirect('/home')
    }


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
            if (error) throw error;
            res.send('http://localhost:7000/article?id=' + results.insertId)
      });
})

app.post('/comment', upload.none(),  (req, res)=>{

    db.query(`INSERT INTO comments (article_id, comment, created_at) VALUES ('${req.body.id}', '${req.body.comment}', NOW())`,
        
        function (error, results, fields) {
            if (error) throw error;
            res.send('lalala')
      });
})

// host running on
app.listen(PORT, ()=>{
    console.log(`SERVER CONNECTED: 7000`);
    
});