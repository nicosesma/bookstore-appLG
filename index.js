var express = require('express');
var app = express();

const database = require('./database')
const pgp = database.pgp;

app.set('view engine', 'pug');

app.get('/', function (req, res) {
    res.render('../views/index.pug');
});

app.get('/search', function (req, res) {
  database.getAllBooks()
    .then(function(books){
      res.render('../views/search.pug', {
        books: books
      })
    })
    .catch(function(error){
      throw error
    })
});

app.listen(3000, function () {
  console.log('Listening on port 3000');
});




//
// database.getBookById(2)
//   .then(function (books) {
//     console.log('BOOK 2:', books);
//     pgp.end();
//   })
//   .catch(function (error) {
//     console.log('ERROR:', error);
//     pgp.end();
//   })
// ;
