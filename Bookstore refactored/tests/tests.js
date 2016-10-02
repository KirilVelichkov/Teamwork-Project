import { usersData } from 'usersData';
import { booksData } from 'booksData';
import { requester } from 'requester';
import { KINVEY } from 'kinvey';
import { UTILS } from 'utils';

mocha.setup('bdd');

let expect = chai.expect;

const LOGIN_URL = 'https://baas.kinvey.com/user/kid_By3bWKRn/login/';
const REGISTER_URL = 'https://baas.kinvey.com/user/kid_By3bWKRn/';
const user = {
    username: 'test2',
    password: 'test2'
};

const BOOKS_RESULT = {
    result: []
};
const GET_ALL_BOOKS_URL = `https://baas.kinvey.com/appdata/kid_By3bWKRn/books/`;

const GENRE_NAME = 'genreName';
const GENRE_FILTER = JSON.stringify({
    "genre": GENRE_NAME
});
const GET_ALL_BOOKS_BY_GENRE_URL = `https://baas.kinvey.com/appdata/kid_By3bWKRn/books/?query=${GENRE_FILTER}`;

const TITLE_NAME = 'titleName';
const TITLE_FILTER = JSON.stringify({
    "title": TITLE_NAME
});
const GET_ALL_BOOKS_BY_TITLE_URL = `https://baas.kinvey.com/appdata/kid_By3bWKRn/books/?query=${TITLE_FILTER}`;

describe('User Tests', function(){

    describe('usersData.login() tests', function(){

        beforeEach(function () {
            sinon.stub(requester, 'postJSON', function (user) {
                return new Promise(function (resolve, reject) {
                    resolve(user);
                });
            });
            localStorage.clear();
        });

        afterEach(function () {
            requester.postJSON.restore();
            localStorage.clear();
        });

        it('(1) Expect: usersData.login() to make correct postJSON call', function (done) {
            usersData.login(user)
                .then(() => {
                    expect(requester.postJSON.firstCall.args[0]).to.equal(LOGIN_URL);
                })
                .then(done, done);
        });

        it('(2) Expect: usersData.login() to make exactly one postJSON call', function (done) {
            usersData.login(user)
                .then(() => {
                    expect(requester.postJSON.calledOnce).to.be.true;
                })
                .then(done, done);
        });

        it('(3) Expect: usersData.login() to put correct user data', function (done) {
            usersData.login(user)
                .then(() => {
                    const actual = requester.postJSON.firstCall.args[1];
                    const props = Object.keys(actual).sort();

                    expect(props.length).to.equal(2);
                    expect(props[0]).to.equal('password');
                    expect(props[1]).to.equal('username');
                })
                .then(done, done);
        });

    });

    describe('usersData.register() tests', function(){
        beforeEach(function () {
            sinon.stub(requester, 'postJSON', function (user) {
                return new Promise(function (resolve, reject) {
                    resolve(user);
                });
            });
        });

        afterEach(function () {
            requester.postJSON.restore();
        });


        it('(1) Expect: usersData.register() to make correct postJSON call', function (done) {
            usersData.register(user)
                .then(() => {
                    expect(requester.postJSON.firstCall.args[0]).to.equal(REGISTER_URL);
                })
                .then(done, done);
        });

        it('(2) Expect: usersData.register() to make exactly one postJSON call', function (done) {
            usersData.register(user)
                .then((res) => {
                    expect(requester.postJSON.calledOnce).to.be.true;
                })
                .then(done, done);
        });

        it('(3) Expect: usersData.login() to put correct user data', function (done) {
            usersData.register(user)
                .then(() => {
                    const actual = requester.postJSON.firstCall.args[1];
                    const props = Object.keys(actual).sort();

                    expect(props.length).to.equal(3);
                    expect(props[0]).to.equal('booksInCart');
                    expect(props[1]).to.equal('password');
                    expect(props[2]).to.equal('username');
                })
                .then(done, done);
        });
    });

});

describe('Books Tests', function(){

    describe('booksData.getAllBooks() tests', function(){
        beforeEach(function () {
            sinon.stub(requester, 'getJSON', function (user) {
                return new Promise(function (resolve, reject) {
                    resolve(BOOKS_RESULT);
                });
            });
        });

        afterEach(function () {
            requester.getJSON.restore();
        });

        it('(1) Expect: booksData.getAllBooks() to make correct getJSON call', function (done) {
            booksData.getAllBooks()
                .then(() => {
                    expect(requester.getJSON.firstCall.args[0]).to.equal(GET_ALL_BOOKS_URL);
                })
                .then(done, done);
        });

        it('(2) Expect: booksData.getAllBooks() to make exactly one getJSON call', function (done) {
            booksData.getAllBooks()
                .then(() => {
                    expect(requester.getJSON.calledOnce).to.be.true;
                })
                .then(done, done);
        });

        it('(3) expect booksData.getAllBooks() to return correct result', function(done) {
			booksData.getAllBooks()
				.then(obj => {
					expect(obj).to.eql(BOOKS_RESULT)
				})
				.then(done, done);
		});
    });

    describe('booksData.getBooksByGenre(genreName) tests', function(){
        beforeEach(function () {
            sinon.stub(requester, 'getJSON', function (user) {
                return new Promise(function (resolve, reject) {
                    resolve(BOOKS_RESULT);
                });
            });
        });

        afterEach(function () {
            requester.getJSON.restore();
        });

        it('(1) Expect: booksData.getBooksByGenre(genreName) to make correct getJSON call', function (done) {
            booksData.getBooksByGenre(GENRE_NAME)
                .then(() => {
                    expect(requester.getJSON.firstCall.args[0]).to.equal(GET_ALL_BOOKS_BY_GENRE_URL);
                })
                .then(done, done);
        });

        it('(2) Expect: booksData.getBooksByGenre(genreName) to make exactly one getJSON call', function (done) {
            booksData.getBooksByGenre(GENRE_NAME)
                .then(() => {
                    expect(requester.getJSON.calledOnce).to.be.true;
                })
                .then(done, done);
        });

        it('(3) expect booksData.getBooksByGenre(genreName) to return correct result', function(done) {
			booksData.getBooksByGenre(GENRE_NAME)
				.then(obj => {
					expect(obj).to.eql(BOOKS_RESULT);
				})
				.then(done, done);
		});
    });

    describe('booksData.getBooksByTitle(titleName) tests', function(){
        beforeEach(function () {
            sinon.stub(requester, 'getJSON', function (user) {
                return new Promise(function (resolve, reject) {
                    resolve(BOOKS_RESULT);
                });
            });
        });

        afterEach(function () {
            requester.getJSON.restore();
        });

        it('(1) Expect: booksData.getBookByTitle(titleName) to make correct getJSON call', function (done) {
            booksData.getBookByTitle(TITLE_NAME)
                .then(() => {
                    expect(requester.getJSON.firstCall.args[0]).to.equal(GET_ALL_BOOKS_BY_TITLE_URL);
                })
                .then(done, done);
        });

        it('(2) Expect: booksData.getBookByTitle(titleName) to make exactly one getJSON call', function (done) {
            booksData.getBookByTitle(TITLE_NAME)
                .then(() => {
                    expect(requester.getJSON.calledOnce).to.be.true;
                })
                .then(done, done);
        });

        it('(3) expect booksData.getBookByTitle(titleName) to return correct result', function(done) {
			booksData.getBookByTitle(TITLE_NAME)
				.then(obj => {
					expect(obj).to.eql(BOOKS_RESULT);
				})
				.then(done, done);
		});
    });
});

describe('UTILS Tests', function () {
    const array = [1, 2, 3, 4, 5, 6, 7, 8];
    const pageNumber = 2;
    const booksOnPageCount = 4;

    it('(1) createBooksOnPage() should return correct books on page', function () {

        const expected = [5, 6, 7, 8];
        const actual = UTILS.createBooksOnPage(array, pageNumber, booksOnPageCount);

        expect(actual).to.eql(expected);
    });

    it('(2) createPageIndeces() should create correct indeces', function () {

        const expected = [1, 2];
        const actual = UTILS.createPageIndeces(array, booksOnPageCount);

        expect(actual).to.eql(expected);
    });

});


mocha.run();
