const axios = require('axios');
const xml2js = require('xml2js');
const debug = require('debug')('library:goodreadsService');

const parser = new xml2js.Parser({ explicitArray: false });

function goodreadsService() {
  function getBookById() {
    return new Promise((resolve, reject) => {
      axios.get('https://www.goodreads.com/book/show/656.xml?key=7aUfrZCz0yHACcpiUTPu5g')
        .then((response) => {
          parser.parseString(response.data, (err, result) => {
            if (err) {
              debug(err);
            } else {
              debug(result);
              resolve(result.GoodreadsResponse.book);
            }
          });
        })
        .catch((error) => {
          debug(error);
          reject(error);
        });
    });
  }

  return { getBookById };
}

module.exports = goodreadsService();
