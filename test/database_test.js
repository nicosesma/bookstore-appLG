process.env.NODE_ENV = 'test'

const expect = require('expect.js');
const database = require('../database')

describe('database', function() {

  beforeEach(function(){
    return database.truncateAllTables()
  })

  describe('#createBook', function() {

    it('should insert a book into the books table', function() {
      const bookAttributes = {
        title: 'Thinking Fast And Slow',
        published_at: '2006/1/1',
        fiction: false,
      }

      return database.createBook(bookAttributes)
        .then(book => {
          expect(book.id).not.to.be(undefined)
          expect(book.title).to.eql('Thinking Fast And Slow');
          expect(book.published_at).to.be.a(Date);
          expect(book.fiction).to.eql(false);

          return database.getBookById(book.id)
            .then(book => {
              expect(book.id).not.to.be(undefined)
              expect(book.title).to.eql('Thinking Fast And Slow');
              expect(book.published_at).to.be.a(Date);
              expect(book.fiction).to.eql(false);
              return book
            })
        })

    });

    describe('#getAllBooks', function() {

      it('should list all book entries from the books table', function() {
        const bookAttributes1 = {
          title: 'Title2',
          published_at: '2007/1/1',
          fiction: false,
        }
        const bookAttributes2 = {
          title: 'Title3',
          published_at: '2007/1/1',
          fiction: false,
        }

        return database.createBook(bookAttributes1)
          .then(book1 =>{
            expect(book1.id).not.to.be(undefined)

            return database.getAllBooks()
              .then(() => {
                expect(book1.title).to.eql('Title2');
              })
          })
      })
    })

    describe('#createAuthor', function() {

      it('should add an Author to authors table', function() {
        const author1 = {name: 'Bob Dole'}
        return database.createAuthor(author1)
          .then(authorName =>{
            expect(authorName.id).not.to.be(undefined)
            expect(authorName.name).to.eql('Bob Dole')
          })
      })
    })

  });

});
