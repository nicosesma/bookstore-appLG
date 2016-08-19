# bookstore-appLG
Create a simple content management system for an online bookstore

## Documentation
To run on a local machine, follow these instructions:
* Clone git repository
* ```npm install```
* If you need to install Postgres, install using: ```brew postgres```
* Create your database: ```createdb bookstore```
* Load SQL into your database: ```psql bookstore < schema.sql```
* Run your localhost: ```nodemon```
* Head to the [homepage!](http://0.0.0.0:3000/)

## Description

Create a simple content management system that allows users to add, delete, or update books.  Books entered in the system can be viewed in a listing, or searched for using basic searches (title, author, genre).

## Context

Creating this web application will provide exposure to:
* Express (or other web framework)
* Javascript
* Simple relational database interactions (Create, Read, Update, Delete), with SQL practice
* Simple server side templating (to render data retrieved from the database)

## Specifications

- [X] Any user can add books into the system via an admin page
- [X] Books entered in the system are listed on the home page, in pages of 10
- [X] Users can search for books by title OR by author OR by genre, and search results will be presented in a new page
- [X] Users can view book details on a book detail page, linked to from the listing or search pages
- [X] All code submissions are peer reviewed via GitHub PR by at least two members of the team, and master is always in a stable state (tests passed, site functions)

### Required

- [X] The artifact produced is properly licensed, preferably with the [MIT license][mit-license].

## Quality Rubric
- [X] User-Friendly - Pages load fast, styled enough to not offend the eye
- [X] Tested - All specs passing
- [X] Documented - In files like CONTRIBUTING.md, so that other devs can quickly start coding
- [X] Functional - Project runs in localhost
- [X] Structured - Directory structure allows new developers to quickly find and add files
- [X] Clearly Named - Functions, variables, files, CSS classes and ids
- [X] Abstracted - Small, single-responsibility functions leveraged for encapsulation & reusability
- [X] Git Logged - Readable and clean with clear, complete, professional commit messages
- [X] Linted - Gets no unexpected errors from jshint linter
- [ ] Reviewed - Passes [3.0 GPA] CodeClimate or peer code review
- [X] Not Commented - Unless truly necessary. No dead code, console.logs, fits/xits

## Resources
Model -
http://ondras.zarovi.cz/sql/demo/
---

<!-- LICENSE -->

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png" /></a>
<br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.

[mit-license]: https://opensource.org/licenses/MIT
