const connectionString = `postgres://${process.env.USER}@localhost:5432/bookstore`
const pgp = require('pg-promise')();
const db = pgp(connectionString);



const getBookById = function(id){
  return db.any('SELECT * FROM books WHERE id=$1', [id])
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


module.exports = {
  pgp: pgp,
  db: db,
  getBookById: getBookById,
  getBooksWhereAuthorNameLike: getBooksWhereAuthorNameLike,
}
