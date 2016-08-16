var express = require('express');
var bodyParser = require('body-parser');

var app = express();

const database = require('./database')
const pgp = database.pgp;

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function (req, res) {
    res.render('../views/index.pug');
});

// GET  /                     // homepage
// GET  /books                // INDEX books index page
// GET  /books/:bookID        // SHOW book show page
//
//
// GET  /admin/books/new            // NEW new book form page
// POST /admin/books                // CREATE new book form page
// GET  /admin/books/:bookID/edit   // EDIT book show page
// POST /admin/books/:bookID        // UPDATE book show page
// POST /admin/books/:bookID/delete // DELETE



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


app.get('/books/new', function (req, res) {
  res.render('create');
});
app.post('/books', function(req, res){
  const book = req.body.book
  database.createBook(book)
    .then(function(book){
      res.json(book)
    })
    .catch(function(error){
      throw error
    })
})
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
