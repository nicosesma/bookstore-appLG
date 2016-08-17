const databaseName = process.env.NODE_ENV === 'test' ? 'bookstore-test' : 'bookstore'
const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')();
const db = pgp(connectionString);


const truncateAllTables = function(){
  return db.none(`
    TRUNCATE
      books,
      genres,
      authors,
      book_genres,
      book_authors
  `)
}

const getAllBooks = function() {
  return db.any('SELECT * FROM books')
}

const getAllGenres = function() {
  return db.any('SELECT * FROM genres')
}


const getBookById = function(id){
  return db.one('SELECT * FROM books WHERE id=$1', [id])
}

const getBooksWhereAuthorNameLike = function(authorNamePart){
  const sql = `
    SELECT
      books.*
    FROM
      books
    JOIN
      book_authors
    ON
      books.id = book_authors.book_id
    JOIN
      authors
    ON
      authors.id = book_authors.author_id
    WHERE
      authors.name LIKE $1;
  `
  return db.any(sql, [`%${authorNamePart}%`])
}

const getBookAuthors = function(bookId){
  const sql = `
    SELECT
      authors.name
    FROM
      authors
    JOIN
      book_authors
    ON
      authors.id = book_authors.author_id
    WHERE
      book_authors.book_id = $1;
  `
  return db.any(sql, [bookId])
}

const getBookAndAuthorsAndGenresByBookId = function(bookId){
  // get the book for bookId X
  // get the authors for bookId X
  // get the genres for bookId X

  // when we get all that data
    // books.authors = authors
    // books.genres = genres
    // return book
  Promise.all([
    getBookById(bookId)
  ])
    .catch(console.log('error'))
    .then(function(book){
      book: book
    })
    .catch(console.log('error'))
  return db.any(bookId)

}

const createBook = function(attributes){
  const sql = `
  INSERT INTO
    books (title, published_at, fiction)
  VALUES
    ($1, $2, $3)
  RETURNING
    *
  `
  return db.one(sql, [
    attributes.title,
    attributes.published_at,
    attributes.fiction,
  ])
}

const searchForBooks = function(options){
  let variables = []
  let sql  = `
    SELECT
      *
    FROM
      books
  `
  let whereConditions = []
  if (options.genres) {
    let genres = Array.isArray(options.genres) ?
      options.genres : [options.genres]
    sql += `
      JOIN
        book_genres
      ON
        book_genres.book_id=books.id
    `
    variables.push(genres)
    whereConditions.push(`
      book_genres.genre_id IN ($${variables.length}:csv)
    `)
  }

  if (options.search_query) {
    variables.push(options.search_query
      .toLowerCase()
      .replace(/^ */, '%')
      .replace(/ *$/, '%')
      .replace(/ +/g, '%')
    )
    whereConditions.push(`
      LOWER(books.title) LIKE $${variables.length}
    `)

  }

  if (whereConditions.length > 0) {
    sql += ' WHERE '+whereConditions.join(' AND ')
  }

  return db.any(sql, variables)
}

module.exports = {
  pgp: pgp,
  db: db,
  truncateAllTables: truncateAllTables,
  getBookById: getBookById,
  getBooksWhereAuthorNameLike: getBooksWhereAuthorNameLike,
  getAllBooks: getAllBooks,
  getAllGenres: getAllGenres,
  createBook: createBook,
  searchForBooks: searchForBooks,
  getBookAuthors: getBookAuthors,
  getBookAndAuthorsAndGenresByBookId: getBookAndAuthorsAndGenresByBookId,
}
