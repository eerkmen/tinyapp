//dependencies
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const {
  getUserByEmail,
  generateRandomString,
  urlsForUser,
} = require('./helpers');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const morgan = require('morgan');
const methodOverride = require('method-override')


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
    id: 1,
    email: 'name@mail.com',
    password: [process.env.password1],
  },
  2: {
    id: 2,
    email: 'name2@mail.com',
    password: [process.env.password2],
  },
};

const urlDatabase = {
  b5UTxQ: {
    longURL: "https://www.amazon.com",
    userID: 2
  },
  i4BoGr: {
    longURL: "https://www.google.com",
    userID: 2
  }
};
//Register GET and POST
app.get('/register', (req, res) => {
  const id = req.session.user_id;
  const user = users[id];
  if (users[id]) {
    return es.redirect('/urls');
  }
  
  res.render("urls_register", user);
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

  const id = generateRandomString(urlDatabase);
  
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
    return es.redirect('/urls');
  }

  res.render("urls_login", user);
});

app.post("/login", (req, res) => {
  
  const email = req.body.email;
  const user = getUserByEmail(email, users);
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send('Please fill out email and password.');
  }

  if (!user || !bcrypt.compareSync(password, users[user.id].password)) {
    return res.status(403).send(`Wrong password, try again`);
  }

  req.session.user_id = users[user.id]['id'];;
  res.redirect("/urls");
});

//Logout
app.post("/logout", (req, res) => {
  req.session = undefined;
  res.redirect("/login");
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

app.get("/urls/:id", (req, res) => {
  if (!req.session.user_id) {
    return res.send(`Try again, something went wrong`);
  }
  const { id } = req.params;
  const templateVars = {
    user: users[req.session.user_id],
    id,
  };
  res.render("urls_show", templateVars);
});

app.get("/", (req, res) => {
  res.redirect('/login');
});






app.post('/urls', (req, res) => {
  if (!req.session.user_id) {
    return res.send(`Try again, something went wrong`);
  }
  
  const short = generateRandomString();
  urlDatabase[short] = {
    longURL: req.body.longURL,
    userId: req.session.user_id,
  };
  res.redirect(`/urls/${newId}`);
});

//url delete
app.post("/urls/:shortURL/delete", (req, res) => {
  if (!req.session.user_id) {
    return res.send(`Try again, something went wrong`);
  }

  delete urlDatabase[req.params.shortURL];
  
  res.redirect("/urls");
});

//editing url
app.post("/urls/:shortURL", (req, res) => {
  
  if (!req.session.user_id) {
    return res.send(`Login first to access this action.`);
  }

  const longURL = req.body.longURL;
  const short = req.params.shortURL;
  urlDatabase[short] = {
    longURL, 
    userID,
  };
  res.redirect("/urls");
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});



//This checks if the server is listening
app.listen(PORT, () => {
  console.log(`Tiny app listening on port ${PORT}!`);
});