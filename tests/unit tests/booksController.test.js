const knexfile = require("../../db/knexfile");
const db = require("knex")(knexfile["development"]);
const booksController  = require('../../controllers/booksController')(db);


test('getBooks function is a function', () => {
    expect(booksController.getBooks()).isAFunction;
})

test('getBooks returns an array', () => {
    expect(booksController.getBooks()).toBeArray;
})

