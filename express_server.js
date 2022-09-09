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

app.use(morgan('dev'));
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SECRET_KEY],
}));

const users = {
  userRandomID: {
    id: 'userRandomID',
    email: 'name@mail.com',
    password: 'PC$R762tM$3HBLHntc$MKXd3$hEBXQGwATTUXvgYgs8ywbmvjTAmbvOf/yEQ',
  },
  user2RandomID: {
    id: 'userRandomID2',
    email: 'name2@mail.com',
    password: 'NMcg1o4zQjG$yD3X82TLTD9n/ud6eE29Yn8UsxCjYgXla3sot$RzMIItPz/Q',
  },
};

const urlDatabase = {
 
};

app.get('/register', (req, res) => {
  const id = req.session.user_id;
  const user = users[id];
  if (users[id]) {
    return es.redirect('/urls');
  }

  res.render("user_register", user);
});

app.get('/login', (req, res) => {
  const id = req.session.user_id;
  const user = users[id];
  if (users[id]) {
    return es.redirect('/urls');
  }

  res.render("urls_login", user);
});

app.get('/urls', (req, res) => {
  
  if (!req.session.user_id) {
    return res.send(`You need to login to continue with this page.`);
  }

  const templateVars = {
    user: users[req.session.user_id],
    urls: urlsForUser(id, urlDatabase),
  };
  res.render('urls_index', templateVars);
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
    url: {
      ...urlDatabase[id],
      uniqueVisitors: getUniqueVisitors(id, urlDatabase),
    }
  };
  res.render("urls_show", templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.post("/login", (req, res) => {
  
  const email = req.body.email;
  const user = getUserByEmail(req.body.email, users);
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send('Please fill out email and password.');
  }

  if (!user || !bcrypt.compareSync(password, users[user][password])) {
    return res.status(403).send(`Wrong password, try again`);
  }

  req.session.user_id = users[user]['id'];;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = undefined;
  res.redirect("/login");
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


app.post("/urls/:shortURL/delete", (req, res) => {
  if (!req.session.user_id) {
    return res.send(`Try again, something went wrong`);
  }

  delete urlDatabase[req.params.shortURL];
  
  res.redirect("/urls");
});

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



app.listen(PORT, () => {
  console.log(`Tiny app listening on port ${PORT}!`);
});