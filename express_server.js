//dependencies
const express = require("express");
const app = express();
require('dotenv').config()
const PORT = 8080; // default port 8080
const {
  getUserByEmail,
  generateRandomString,
  urlsForUser,
} = require('./helpers');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const morgan = require('morgan');
const methodOverride = require('method-override');
const bodyParser = require("body-parser");

//Middleware
app.use(morgan('dev'));
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'user_id',
  keys: [process.env.SECRET_KEY],
}));
app.use(methodOverride('_method'));

//databases
const users = {
  1: {
    id: process.env.id1,
    email: process.env.email1,
    password: bcrypt.hashSync(process.env.password1),
  },
  2: {
    id: process.env.id2,
    email: process.env.email2,
    password: bcrypt.hashSync(process.env.password2),
  },
};

const urlDatabase = {
  b5UTxQ: {
    longURL: "https://www.amazon.com",
    userID: process.env.id1
  },
  i4BoGr: {
    longURL: "https://www.google.com",
    userID: process.env.id1
  }
};
//Register GET and POST
app.get('/register', (req, res) => {
  const id = req.session.user_id;
  const user = users[id];
  if (users[id]) {
    return es.redirect('/urls');
  }
  res.render("urls_register", { user: null });
});

app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send('Please fill out email and password.');
  }
  if (getUserByEmail(email, users)) {
    return res.status(400).send('Try a different email, it is already taken.');
  }
  const id = generateRandomString();
    users[id] = {
    id,
    email,
    password: bcrypt.hashSync(password),
  };
  req.session.user_id = id;
  res.redirect("/urls");
});

//Login GET and POST
app.get('/login', (req, res) => {
  const id = req.session.user_id;
  const user = users[id];
  if (users[id]) {
    return res.redirect('/urls');
  }
  res.render("urls_login", { user: null });
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const user = getUserByEmail(email, users);
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).send('Please fill out email and password.');
  }
  if (!user || !bcrypt.compareSync(password, users[user['id']]['password'])) {
    return res.status(403).send(`Wrong login information, try again.`);
  }
  req.session.user_id = users[user.id]['id'];;
  res.redirect("/urls");
});

//Logout
app.post("/logout", (req, res) => {
  req.session = undefined;
  res.redirect("/urls");
});

//url and it's routes
app.get('/urls', (req, res) => {
  if (!req.session.user_id) {
    return res.send(`You need to login to continue with this page.`);
  }
  const templateVars = {
    user: users[req.session.user_id],
    urls: urlsForUser(req.session.user_id, urlDatabase),
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    return res.redirect('/login');
  }
  const templateVars = { 
    user: users[req.session.user_id] 
  };
  res.render("urls_new", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const short = req.params.shortURL;
  const ul = urlDatabase[short];
  if (!ul) {
    return res.send('TRY AGAIN');
  }
  res.redirect(url.longURL);
});

//Short URL edit
app.get("/urls/:id", (req, res) => {
  const userID = req.session.user_id;
  if (!req.session.user_id) {
    return res.send(`Try again, something went wrong`);
  }
  if (urlDatabase[req.params.id].userID !== userID) {
    return res.send("You don't have permission to change this URL data.");
  }
  const { id } = req.params;
  const templateVars = {
    user: users[req.session.user_id],
    shortURL: id,
    longURL: urlDatabase[id]['longURL']
  };
  res.render("urls_show", templateVars);
});

app.get("/", (req, res) => {
  res.redirect('/login');
});

//new short url creation
app.post('/urls', (req, res) => {
  if (!req.session.user_id) {
    return res.send(`Try again, something went wrong`);
  }
  const id = generateRandomString();
  urlDatabase[id] = {
    longURL: req.body.longURL,
    userID: req.session.user_id,
  };
  res.redirect(`/urls/${id}`);
});

//short url delete
app.post("/urls/:id/delete", (req, res) => {
  const userID = req.session.user_id;
  if (!req.session.user_id) {
    return res.send(`Try again, something went wrong`);
  }
  if (urlDatabase[req.params.id].userID !== userID) {
    return res.send("You don't have permission to delete this URL data.");
  } else {
    delete urlDatabase[req.params.id];
  }
  res.redirect("/urls");
});

//editing short url
app.post("/urls/:id", (req, res) => {
  if (!req.session.user_id) {
    return res.send(`Login first to access this action.`);
  }
  const id = generateRandomString();
  urlDatabase[id] = {
    longURL: req.body.longURL,
    userID: req.session.user_id,
  };
  res.redirect(`/urls/${id}`);
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//This checks if the server is listening
app.listen(PORT, () => {
  console.log(`Tiny app listening on port ${PORT}!`);
});