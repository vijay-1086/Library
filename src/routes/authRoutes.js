const express = require('express');
const debug = require('debug')('library:authRoutes');
const { MongoClient } = require('mongodb');
const passport = require('passport');


function router(nav) {
  const authRouter = express.Router();

  authRouter.route('/signUp')
    .post((req, res) => {
      const { username, password } = req.body;

      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';

      (async function createUser() {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const collection = db.collection('users');
        try {
          const result = await collection.insertOne({ username, password });
          debug(result);
          req.login(result.ops[0], () => {
            res.redirect('/auth/profile');
          });
        } catch (error) {
          debug(error.stack);
        }
      }());
      // res.send('hola');
    });

  authRouter.route('/signin')
    .get((req, res) => {
      res.render('signin',
        {
          nav,
          title: 'Library'
        });
    })
    .post(passport.authenticate('local', {
      successRedirect: '/auth/profile',
      failureRedirect: '/'
    }));

  authRouter.route('/profile')
    .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.redirect('/');
      }
    })
    .get((req, res) => {
      res.json(req.user);
    });

  return authRouter;
}

module.exports = router;
