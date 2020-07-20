// Initialize express
const express = require('express')
const Handlebars = require('handlebars')
const app = express()
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

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

// Tell our app to send the "hello world" message to our home page
// app.get('/', (req, res) => {
//   res.render('index');
// })

app.get('/posts/new', (req,res) =>{
  res.render('posts-new')
})

require('./controllers/posts.js')(app);

// Choose a port to listen on
const port = process.env.PORT || 3000;

// Tell the app what port to listen on
app.listen(port, () => {
  console.log('App listening on port 3000!')
})