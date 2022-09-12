const urlsForUser = function(userId, database) {
  const urls = {};
  for (const ui in database) {
    if (userId === database[ui]['userID']) {
      urls[ui] = { 
        longURL: database[ui]['longURL'],
        userId,
      }
    }
  }
  return urls;
};

const getUserByEmail = function(email, database) {

  for (const id in database) {
    if (database[id].email === email) {
      return database[id];
    }
  }
  return undefined;
};

const generateRandomString = function() {
  let random = '';
  let char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 7; i++) {
    random += char.charAt(Math.floor(Math.random() * char.length));
  }
  return random;
};

const canAccessURL = (req, ui, database) => {
  const user = req.session.user_id;
  return ui in urlsForUser(user, database);
};

module.exports = { 
  canAccessURL,
  getUserByEmail,
  urlsForUser,
  generateRandomString,
};