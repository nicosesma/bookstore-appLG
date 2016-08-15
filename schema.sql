DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  published_at DATE NOT NULL,
  fiction BOOLEAN NOT NULL
);

DROP TABLE IF EXISTS genres;

CREATE TABLE genres (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS book_genres;

CREATE TABLE book_genres (
  book_id INTEGER NOT NULL,
  genre_id INTEGER NOT NULL
);

DROP TABLE IF EXISTS authors;

CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS book_authors;

CREATE TABLE book_authors (
  book_id INTEGER NOT NULL,
  author_id INTEGER NOT NULL
);


--Fixture Data

INSERT INTO
  books (title, published_at, fiction)
VALUES
  ('Wealth of Nations', now(), false),
  ('White Fang', now(), true);


INSERT INTO
  genres (name)
VALUES
  ('Economics'),
  ('Fantasy'),
  ('Horror'),
  ('Sci-Fi');

INSERT INTO
  book_genres
SELECT
  books.id, genres.id
FROM
  books
CROSS JOIN
  genres
WHERE
  books.title = 'White Fang'
AND
  genres.name = 'Fantasy';


INSERT INTO
  authors (name)
VALUES
  ('Adam Smith'),
  ('Jack London');

INSERT INTO
  book_authors
SELECT
  books.id, authors.id
FROM
  books
CROSS JOIN
  authors
WHERE
  books.title = 'White Fang'
AND
  authors.name = 'Jack London';

INSERT INTO
  book_authors
SELECT
  books.id, authors.id
FROM
  books
CROSS JOIN
  authors
WHERE
  books.title = 'Wealth of Nations'
AND
  authors.name = 'Adam Smith';


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
  authors.name='Adam';
