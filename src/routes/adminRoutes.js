const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('library:adminRoutes');

const books = [{ title: 'Chacha Chowdhury', author: 'Pran', id: '1' },
  { title: 'War and Peace', author: 'Leo Tolstoy', id: '2' },
  { title: 'Guns, Germs and Steel', author: 'Jared Diamond', id: '3' },
  { title: 'Animal Farm', author: 'George Orwell', id: '4' }];

function router() {
  const adminRouter = express.Router();

  adminRouter.route('/')
    .get((req, res) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';

      (async function mongoInsert() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected to the mongodb server');
          const db = client.db(dbName);
          const response = await db.collection('books').insertMany(books);
          res.json(response);
        } catch (error) {
          debug(error.stack);
        }
        client.close();
      }());
    });
  return adminRouter;
}

module.exports = router;
