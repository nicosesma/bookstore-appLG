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

const getAllBooks = function(page) {
  const offset = (page-1) * 10;
  console.log("select * FROM books LIMIT 10 OFFSET " + offset)
  return db.any('SELECT * FROM books LIMIT 10 OFFSET $1', [offset])
    .then(loadAuthorsAndGenresForBooks)
}

const loadAuthorsAndGenresForBooks = function(books){
  const bookIds = books.map(book => book.id)
  return Promise.all([
    loadAuthorsForBookIds(bookIds),
    loadGenresForBookIds(bookIds),
  ]).then(results => {
    const authors = results[0]
    const genres = results[1]
    books.forEach(book => {
      book.authors = authors.filter(author => author.book_id === book.id)
      book.genres = genres.filter(genre => genre.book_id === book.id)
    })
    return books;
  })
}

const loadAuthorsForBookIds = function(bookIds){
  const sql = `
    SELECT
      authors.*,
      book_authors.book_id
    FROM
      authors
    JOIN
      book_authors
    ON
      book_authors.author_id = authors.id
    WHERE
      book_authors.book_id IN ($1:csv)
  `
  return db.any(sql, [bookIds])
}

const loadGenresForBookIds = function(bookIds){
  const sql = `
  SELECT
    genres.*,
    book_genres.book_id
  FROM
    genres
  JOIN
    book_genres
  ON
    book_genres.genre_id = genres.id
  WHERE
    book_genres.book_id IN ($1:csv)
  `
  return db.any(sql, [bookIds])
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

const getBookGenres = function(bookId){
  const sql = `
    SELECT
      genres.name
    FROM
      genres
    JOIN
      book_genres
    ON
      genres.id = book_genres.genre_id
    WHERE
      book_genres.book_id = $1;
  `
  return db.any(sql, [bookId])
}

const getBookAndAuthorsAndGenresByBookId = function(bookId){
  return Promise.all([
    getBookById(bookId),
    getBookAuthors(bookId),
    getBookGenres(bookId),
  ])
    .catch(function(error){
      console.log(error)
      throw error;
    })
    .then(function(results){
      const book = results[0]
      const authors = results[1]
      const genres = results[2]

      book.authors = authors
      book.genres = genres
      return book;
    })
}

const createAuthor = function(name){
  const sql = `
  INSERT INTO
    authors (name)
  VALUES
    ($1)
  RETURNING
    *
  `
  return db.one(sql, [name.name])
}

const associateAuthorsWithBook = function(authorIds, bookId){
  authorIds = Array.isArray(authorIds) ? authorIds : [authorIds]
  let queries = authorIds.map(authorId => {
    const sql = `
      INSERT INTO
        book_authors(book_id, author_id)
      VALUES
        ($1, $2)
    `
    return db.none(sql, [bookId, authorId])
  })
  return Promise.all(queries)
}

const associateGenresWithBook = function(genreIds, bookId){
  genreIds = Array.isArray(genreIds) ? genreIds : [genreIds]

  console.log('IDs:', genreIds, bookId);

  let queries = genreIds.map(genreId => {
    let sql = `
    INSERT INTO
      book_genres(book_id, genre_id)
    VALUES
      ($1, $2)
    `
    return db.none(sql, [bookId, genreId])
  })
  return Promise.all(queries)
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
  let queries = [
    db.one(sql, [
      attributes.title,
      attributes.published_at,
      attributes.fiction,
    ])
  ]
  attributes.authors.forEach(author =>
    queries.push(createAuthor(author))
  )
  return Promise.all(queries)
    .then(authorIds => {
      authorIds = authorIds.map(x => x.id)
      const bookId = authorIds.shift()
      return Promise.all([
        associateAuthorsWithBook(authorIds, bookId),
        associateGenresWithBook(attributes.genres, bookId),
      ]).then(function(){
        return bookId;
      })
    })
}

const searchForBooks = function(options){
  let variables = []
  let sql  = `
    SELECT
      DISTINCT(books.*)
    FROM
      books
  `
  let whereConditions = []
  if (options.fiction !== '') {
    variables.push(options.fiction === 'true')
    whereConditions.push(`
      books.fiction IS $${variables.length}
    `)
  }
  if (options.genres.length > 0) {
    sql += `
      LEFT JOIN
        book_genres
      ON
        book_genres.book_id=books.id
    `
    variables.push(options.genres)
    whereConditions.push(`
      book_genres.genre_id IN ($${variables.length}:csv)
    `)
  }

  if (options.search_query) {
    sql += `
      LEFT JOIN
        book_authors
      ON
        book_authors.book_id=books.id
      LEFT JOIN
        authors
      ON
        authors.id=book_authors.author_id
    `
    variables.push(options.search_query
      .toLowerCase()
      .replace(/^ */, '%')
      .replace(/ *$/, '%')
      .replace(/ +/g, '%')
    )
    whereConditions.push(`
      (
        LOWER(books.title) LIKE $${variables.length}
      OR
        LOWER(authors.name) LIKE $${variables.length}
      )
    `)

  }

  if (whereConditions.length > 0) {
    sql += ' WHERE '+whereConditions.join(' AND ')
  }

  console.log('SQL --->', sql, variables)
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
  createAuthor: createAuthor,
}
