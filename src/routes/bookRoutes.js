const express = require('express');
const bookController = require('../controllers/bookController');

function router(nav) {
  const bookRouter = express.Router();
  const { getBooks, getById, authorize } = bookController(nav);

  bookRouter.use(authorize);

  bookRouter.route('/')
    .get(getBooks);

  bookRouter.route('/:id')
    .get(getById);


  return bookRouter;
}
module.exports = router;
