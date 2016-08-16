const connectionString = `postgres://${process.env.USER}@localhost:5432/bookstore`
const pgp = require('pg-promise')();
const db = pgp(connectionString);


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
  console.log(getBookById(bookId));
  // const sql = `
  //   SELECT
  //     authors.*
  //   FROM
  //     authors
  //   JOIN
  //     book_authors
  //   ON
  //     books.id = book_authors.book_id
  //   JOIN
  //     books
  //   ON
  //     books.id = book_authors.book_id
  //   WHERE
  //     books.id LIKE bookId=$1;
  // `
  return db.one([getBookById(bookId)])
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
  getBookById: getBookById,
  getBooksWhereAuthorNameLike: getBooksWhereAuthorNameLike,
  getAllBooks: getAllBooks,
  getAllGenres: getAllGenres,
  createBook: createBook,
  searchForBooks: searchForBooks,
  getBookAuthors: getBookAuthors,
}
