var express = require('express');
var bodyParser = require('body-parser');

var app = express();

const database = require('./database')
const pgp = database.pgp;

app.set('view engine', 'pug');
app.use(express.static('public'));
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

const renderError = function(error){
  res.status(500).render('error',{
    error: error
  })
  throw error
}

app.get('/search', function (req, res) {
  Promise.all([
    database.getAllGenres(),
    database.searchForBooks(req.query)
  ])
    .catch(renderError)
    .then(function(data){
      const genres = data[0];
      const books = data[1];
      res.render('search', {
        genres: genres,
        books: books
      })
    })
});


app.get('/books', function (req, res) {
  database.getAllBooks()
    .catch(renderError)
    .then(function(books){
      res.render('books/index', {
        books: books
      })
    })
    .catch(function(error){
      throw error
    })

});


app.get('/books/new', function (req, res) {
  res.render('books/new');
});

app.get('/books/:bookId', function (req, res) {
  database.getBookById(req.params.bookId)
    .catch(renderError)
    .then(function(book){
      res.render('books/show',{
        book: book
      });
    })
    .catch(renderError)
});

app.post('/books', function(req, res){
  const book = req.body.book
  book.fiction = 'fiction' in book;
  database.createBook(book)
    .then(function(book){
      res.redirect('/books/'+book.id)
    })
    .catch(function(error){
      console.log(error)
      throw error
    })
})


app.listen(3000, function () {
  console.log('Listening on port 3000');
});
