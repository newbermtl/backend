const knexfile         = require("../../db/knexfile");
const db               = require("knex")(knexfile["development"]);
const books            = require('../../controllers/booksController')(db);
const status           = require('../../controllers/statusController')(db);
const bookstores       = require('../../controllers/bookstoresController')(db);
const bookstoresBooks  = require('../../controllers/bookstoresBooksController')(db);


describe('Functional Api flow', () => {

    test('Book can be created', async() => {
        books.createBook("The New Book", "Orwell", "Much action");
        expect(await books.getBookByContent("The New Book", "Orwell")).toBeTruthy;
    });

    test('Book store can be created', async() => {
        bookstores.createBookstore('Fred Bookstore');
        expect(await bookstores.getBookstoreByContent('Fred Bookstore')).toBeTruthy;
    });

    test('Book can be added to bookstore', async() => {
        const newBook = await books.getBookByContent("The New Book", "Orwell");
        const newBookstore = await bookstores.getBookstoreByContent('Fred Bookstore');

        bookstoresBooks.createBookstoresBooks(newBook[0].id, newBookstore[0].id, 5);
        expect(await books.getBookstoresForBookById(newBook[0].id)).toEqual(
          expect.arrayContaining(
            [newBookstore]
            )
          )
    });

    test('Can update the amount of books held by a bookstore', async() => {
        const newBook = await books.getBookByContent("The New Book", "Orwell");
        const newBookstore = await bookstores.getBookstoreByContent('Fred Bookstore');
        const newBookstoresBooks = await bookstoresBooks.getBookstoresBooksByContent(newBook[0].id, newBookstore[0].id);

        bookstoresBooks.updateBookstoresBooks(newBookstoresBooks.id, 6)
        expect(await bookstoresBooks.getBookstoresBooksByContent(newBook[0].id, newBookstore[0].id)[0].quantity).toEqual('6')
    });

    test('Get book also returns newly added book', async () => {
        const newBook = await books.getBookByContent("The New Book", "Orwell")

        expect(await books.getBooks()).toEqual(
          expect.arrayContaining(
            (newBook)
            )
          );
    });

    test('Bookstorebooks can be deleted', async () => {
        const newBook = await books.getBookByContent("The New Book", "Orwell")
        const newBookstore = await bookstores.getBookstoreByContent('Fred Bookstore')
        let newBookstoresBooks = await bookstoresBooks.getBookstoresBooksByContent(newBook[0].id, newBookstore[0].id);
        bookstoresBooks.deleteBookstoresBooksById(newBookstoresBooks[0].id);

        newBookstoresBooks = await bookstoresBooks.getBookstoresBooksByContent(newBook[0].id, newBookstore[0].id);
        expect(await bookstoresBooks.getBookstoresBooksById(newBookstoresBooks.id)).toBeFalsy;
    });

    test('Bookstore can be deleted', async () => {
        const newBookstore = await bookstores.getBookstoreByContent('Fred Bookstore')
        bookstores.deleteBookstoreById(newBookstore[0].id);

        expect(await bookstores.getBookstoreById(newBookstore[0].id)).toBeFalsy;
    })

    test('Book can be deleted', async () => {
        const newBook = await books.getBookByContent("The New Book", "Orwell")
        books.deleteBookById(newBook[0].id);

        expect(await books.getBookById(newBook[0].id)).toBeFalsy;
    })
})

