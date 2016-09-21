import Sammy from 'sammy';
import $ from 'jquery';
import { CONSTANTS } from 'constants';
import { UTILS } from 'utils';
import { templates } from 'templates';
import { booksData } from 'booksData';
import { usersData } from 'usersData';

var router = Sammy('#content', function () {
    var $content = $('#content');

    this.get('#/home/:pageNumber', function () {
        var pageNumber = this.params['pageNumber'];
        var totalBooks;
        var booksOnPage;
        var pageIndeces;
        // booksData.addBookToCart().then(function(result){
        //     console.log(result.booksInCart);
            
        // });

        booksData.getAllBooks()
            .then(function (result) {
                booksOnPage = UTILS.createBooksOnPage(result, pageNumber, CONSTANTS.PAGE_SIZE_BIG);
                pageIndeces = UTILS.createPageIndeces(result, CONSTANTS.PAGE_SIZE_BIG);
                totalBooks = {
                    books: booksOnPage,
                    indeces: pageIndeces
                };

                return templates.get('home');
            })
            .then(function (template) {
                $content.html(template(totalBooks));

                $('.book-title').on('click', function () {
                    var currentTitle = $(this).html();
                    localStorage.setItem('CURRENT_TITLE', currentTitle);
                });
            });
    });

    this.get('#/login', function (context) {
        if (usersData.current()) {
            context.redirect('#/home/1');
            return;
        }

        templates.get('login')
            .then(function (template) {
                $content.html(template());

                $('#btn-login').on('click', function () {
                    var logUser = {
                        username: $('#tb-username').val(),
                        password: $('#tb-password').val()
                    };

                    usersData.login(logUser)
                        .then(function (response) {
                            context.redirect('#/');
                            document.location.reload(true);
                        });
                });
            });
    });

    this.get('#/register', function (context) {
        if (usersData.current()) {
            context.redirect('#/home/1');
            return;
        }
        templates.get('register')
            .then(function (template) {
                $content.html(template());
                $('#btn-register').on('click', function () {
                    var newUser = {
                        username: $('#tb-newUsername').val(),
                        password: $('#tb-newPassword').val()
                    };

                    usersData.register(newUser)
                        .then(function (response) {
                            context.redirect('#/');
                            document.location.reload(true);
                        });
                });
            });
    });

    this.get('#/genre-info/?:genre&:pageNumber', function (context) {
        var genre = this.params['genre'];
        var pageNumber = this.params['pageNumber'];
        var category;
        var booksOnPage;
        var pageIndeces;

        booksData.getBooksByGenre(genre)
            .then(function (result) {
                booksOnPage = UTILS.createBooksOnPage(result, pageNumber, CONSTANTS.PAGE_SIZE_SMALL);
                pageIndeces = UTILS.createPageIndeces(result, CONSTANTS.PAGE_SIZE_SMALL);

                category = {
                    name: genre,
                    books: booksOnPage,
                    indeces: pageIndeces
                };

                return templates.get('genre-info');
            })
            .then(function (template) {
                $content.html(template(category));

                $('.book-title').on('click', function () {
                    var currentTitle = $(this).html();
                    localStorage.setItem('CURRENT_TITLE', currentTitle);
                });
            });
    });

    this.get('#/book-info', function (context) {
        var currentTitle = localStorage.getItem('CURRENT_TITLE');
        var book;

        booksData.getBookByTitle(currentTitle)
            .then(function (result) {
                book = result[0];
                return templates.get('book-info');
            })
            .then(function (template) {
                $content.html(template(book));

                $('#btn-like').on('click', function () {
                    booksData.rateBookPositive(book);
                });
                $('#btn-dislike').on('click', function () {
                    booksData.rateBookNegative(book);
                });
            });
    });

});

if (usersData.current()) {
    $('#nav-btn-login, #nav-btn-register').toggle('hidden');

} else {
    $('#nav-btn-logout').toggle('hidden');
    $('#detailed-btn').toggle('hidden');
}

$('#nav-btn-logout').on('click', function () {
    usersData.logout()
        .then(function () {
            location = '#/home/1';
            document.location.reload(true);
        });
});

$('#shopping-cart-button').on('mouseenter', function () {
    $('#shopping-cart-menu').removeClass('hidden');
});

$('#shopping-cart-button').on('mouseleave', function () {
    $('#shopping-cart-menu').addClass('hidden');
});

router.run('#/home/1');
let sammyApp = {};
export { sammyApp as sammyApp };