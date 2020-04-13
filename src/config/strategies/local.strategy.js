const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('library:local.strategy');

function localStrategy() {
  passport.use(new Strategy(
    {
      usernameField: 'userName',
      passwordField: 'password'
    },
    (userName, password, done) => {
      (async function validateUser() {
        try {
          const client = await MongoClient.connect('mongodb://localhost:27017');
          const db = client.db('libraryApp');
          const collection = db.collection('users');
          const user = await collection.findOne({ userName });

          if (user.password === password) {
            done(null, user);
          } else {
            done(null, false);
          }
        } catch (error) {
          debug(error.stack);
        }
      }());
    }
  ));
}

module.exports = localStrategy;
