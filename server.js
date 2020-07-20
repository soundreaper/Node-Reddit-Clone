require('dotenv').config();
// Initialize
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const express = require('express')
const Handlebars = require('handlebars')
const app = express()
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

var checkAuth = (req, res, next) => {
  console.log("Checking authentication");
  if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
    req.user = null;
  } else {
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
  }

  next();
};

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add after body parser initialization!
app.use(expressValidator());

const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

// Use "main" as our default layout
app.engine('handlebars', exphbs({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  defaultLayout: 'main'
  })
);

// Use handlebars to render
app.set('view engine', 'handlebars');

// Set db
require('./data/reddit-db');

app.use(cookieParser()); // Add this after you initialize express.

// Tell our app to send the "hello world" message to our home page
// app.get('/', (req, res) => {
//   res.render('index');
// })

app.get('/posts/new', (req,res) =>{
  res.render('posts-new')
})

app.use(checkAuth);
require('./controllers/posts.js')(app);
require('./controllers/comments.js')(app);
require('./controllers/auth.js')(app);

// Choose a port to listen on
const port = process.env.PORT || 3000;

// Tell the app what port to listen on
app.listen(port, () => {
  console.log('App listening on port 3000!')
})

module.exports = app;