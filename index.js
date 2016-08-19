var express = require('express');
var bodyParser = require('body-parser');

var app = express();

const database = require('./database')
const pgp = database.pgp;

app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function (req, res) {
  let page = parseInt(req.query.page, 10);
  if (isNaN(page)) page = 1;

  database.getAllBooks(page)
    .catch(renderError(res))
    .then(function(books){
      res.render('books/index', {
        page: page,
        books: books
      })
    })
    .catch(function(error){
      throw error
    })
});

const renderError = function(res){
  return function(error){
    res.status(500).render('error',{
      error: error
    })
    throw error
  }
}

app.get('/search', function (req, res) {
  const searchOptions = req.query
  // console.log(JSON.stringify(searchOptions, null, 4))
  if (!('genres' in searchOptions))
    searchOptions.genres = []
  if (!Array.isArray(searchOptions.genres))
    searchOptions.genres = [searchOptions.genres]

  if (!('fiction' in searchOptions)) searchOptions.fiction = ''

  Promise.all([
    database.getAllGenres(),
    database.searchForBooks(searchOptions)
  ])
    .catch(renderError(res))
    .then(function(data){
      const genres = data[0];
      const books = data[1];
      res.render('search', {
        genres: genres,
        books: books,
        searchOptions: searchOptions
      })
    })
});


app.get('/books', function (req, res) {
  let page = parseInt(req.query.page, 10);
  if (isNaN(page)) page = 1;

  database.getAllBooks(page)
    .catch(renderError(res))
    .then(function(books){
      res.render('books/index', {
        page: page,
        books: books
      })
    })
    .catch(function(error){
      throw error
    })
});

app.get('/books/new', function (req, res) {
  database.getAllGenres()
    .then(function(genres){
      res.render('books/new', {
        genres: genres
      })
    })
    .catch(renderError(res))
});

app.get('/books/:bookId', function (req, res) {
  // database.getBookById(req.params.bookId)
  database.getBookAndAuthorsAndGenresByBookId(req.params.bookId)
    .catch(renderError(res))
    .then(function(book){
      res.render('books/show',{
        book: book
      });
      console.log('book: ', book)
    })
    .catch(renderError(res))
});


app.post('/books', function(req, res){
  const book = req.body.book
  book.fiction = 'fiction' in book;
  database.createBook(book)
    .then(function(book){
      res.redirect(`/books/${book}`)
    })
    .catch(function(error){
      console.log(error)
      throw error
    })
})


app.listen(3000, function () {
  console.log('Listening on port 3000');
});
