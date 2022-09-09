const urlsForUser = function(id, database) {
  let urls = {};
  for (const urlId in database) {

    if (id === database[urlId].userID) {
      userURLS = { ...urls, [urlId]: database[urlId] };
    }
  }
  return userURLS;
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

const canAccessURL = (req, urlId, database) => {
  const user = req.session.user_id;
  return urlId in urlsForUser(user, database);
};

module.exports = { 
  canAccessURL,
  getUserByEmail,
  urlsForUser,
  generateRandomString,
};