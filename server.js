// Initialize express
const express = require('express')
const app = express()
const path = require('path')
require('dotenv').config();

// get data back from db 
const handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const exphbs = require('express-handlebars');
const hbs = exphbs.create({
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(handlebars),
});

// Models
const Post = require('./models/post')
const Comment = require('./models/comment')

// Database
const database = require('./data/reddit-db')

// Middleware
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const bcrypt = require('bcryptjs')
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// Controllers
const posts = require('./controllers/posts.js')
const comments = require('./controllers/comments.js')
const auth = require('./controllers/auth.js')
const replies = require('./controllers/replies.js')

app.engine('handlebars', hbs.engine);

// Use handlebars to render
app.set('view engine', 'handlebars');

var checkAuth = (req, res, next) => {
  console.log("Checking authentication");



  // if (typeof req.cookies === "undefined" || typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
    if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
      console.log("cookie is undefined")
    req.user = null;
  } else {
    console.log("cookie is defined")

    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    console.log(decodedToken.payload)
    req.user = decodedToken.payload;
  }

  next();
};

app.use(cookieParser())

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator())
app.use(checkAuth);

// Access controllers & database
app.use(posts)
app.use(comments)
app.use(auth)
app.use(express.static('public'));

// Choose a port to listen on
const port = process.env.PORT || 3000;

// Tell the app what port to listen on
app.listen(port, () => {
  console.log('App listening on port 3000!')
})

module.exports = app;