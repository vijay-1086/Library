const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('library:bookController');
const bookService = require('../services/goodreadsService');

let url; let dbName; let collection; let client; let db; let
  coll;

(async function setupConnection() {
  url = 'mongodb://localhost:27017';
  dbName = 'libraryApp';
  collection = 'books';
  client = await MongoClient.connect(url);
  db = client.db(dbName);
  coll = db.collection(collection);
}());


function bookController(nav) {
  function getBooks(req, res) {
    (async function mongoSelect() {
      try {
        const books = await coll.find().toArray();
        res.render('bookListView',
          {
            nav,
            books,
            title: 'Library'
          });
      } catch (error) {
        debug(error.stack);
      }
    }());
  }

  function getById(req, res) {
    const { id } = req.params;
    (async function mongoSelectOne() {
      try {
        const book = await coll.findOne({ _id: new ObjectID(id) });
        debug(book);

        book.details = await bookService.getBookById(book.id);
        debug(book.details.description);
        // book.description = description;

        res.render('bookView',
          {
            nav,
            title: 'Library',
            book
          });
      } catch (error) {
        debug(error.stack);
      }
    }());
  }

  function authorize(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  }

  return {
    getBooks,
    getById,
    authorize
  };
}


module.exports = bookController;
