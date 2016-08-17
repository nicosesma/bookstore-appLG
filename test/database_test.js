process.env.NODE_ENV = 'test'

const expect = require('expect.js');
const database = require('../database')

describe('database', function() {

  beforeEach(function(){
    return database.truncateAllTables()
  })

  describe('#createBook', function() {

    it('should inset a book into the books table', function() {
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

  });

});
