promises

//
// const createBook = function(bookAttributes){
//   // unknown blackbox async functionality
//   return promise;
// }
//
//
// const createAuthor = function(){
//
// };
// const createGenre = function(){

};
//
//
// Promise.all([
//   createBook(...),
//   createAuthor(...),
//   createGenre(...),
//   createGenre(...),
//   createGenre(...),
//   createGenre(...)
// ]).then(function(data){
//   data[0]
//   data[1]
//   data[2]
//   data[3]
//   data[4]
// })
//
// //
// // createBook({title: 'foobar'}, function(book){
// //
// //   createAuthor({title: 'foobar'}, function(author){
// //
// //     createGenres({title: 'foobar'}, function(author){
// //
// //       createGenres({title: 'foobar'}, function(author){
// //
// //         createGenres({title: 'foobar'}, function(author){
// //
// //         })
// //
// //       })
// //
// //     })
// //
// //   })
// //
// // })
// //
// // createBook({title: 'foobar'})
// //   .then(function(book){
// //     return createAuthor({title: 'foobar'})
// //       .then(function(author){
// //         return {
// //           book: book,
// //           author: author
// //         }
// //       })
// //   })
// //   .then(function(things){
// //     return createGenres({title: 'foobar'})
// //       .then(function(genre){
// //         return {
// //           book: things.books,
// //           author: things.author,
// //           genre: genre
// //         }
// //       })
// //   })
// //
// //
// //
// //
// // createBook({title: 'foobar'})
// //   .then(function(book){
// //     return book.title;
// //   })
// //   .then(function(bookTitle){
// //     return bookTitle.toUpperCase();
// //   })
// //   .then(function(bookTitle){
// //     return bookTitle[0];
// //   })
// // ;
