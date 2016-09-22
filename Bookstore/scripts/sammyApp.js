import Sammy from 'sammy';
import $ from 'jquery';
import { CONSTANTS } from 'constants';
import { UTILS } from 'utils';
import { templates } from 'templates';
import { booksData } from 'booksData';
import { usersData } from 'usersData';

var router = Sammy('#content', function () {
    var $content = $('#content');
    var $orderBy = $('#orderby');
    var booksInCart = [];

    if (usersData.current()) {
        $('#nav-btn-login, #nav-btn-register').toggle('hidden');
        $('#shopping-cart-button').removeClass('hidden');
        $('#nav-btn-logout').removeClass('hidden');
        $('#detailed-btn').removeClass('hidden');
    } else {
        $('#shopping-cart-button').addClass('hidden');
        $('#nav-btn-logout').addClass('hidden');
        $('#detailed-btn').addClass('hidden');
    }

    this.get('#/home/:pageNumber', function () {
        var pageNumber = this.params['pageNumber'];
        var totalBooks;
        var booksOnPage;
        var pageIndeces;


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
                            context.redirect('#/home/1');
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
                            context.redirect('#/home/1');
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
                if (usersData.current()) {
                    $('#btn-like').removeClass('hidden');
                    $('#btn-dislike').removeClass('hidden');
                    $('#btn-add-to-cart').removeClass('hidden');
                } else {
                    $('#btn-like').addClass('hidden');
                    $('#btn-dislike').addClass('hidden');
                    $('#btn-add-to-cart').addClass('hidden');
                }

                $('#btn-like').on('click', function () {
                    booksData.rateBookPositive(book);
                });

                $('#btn-dislike').on('click', function () {
                    booksData.rateBookNegative(book);
                });

                $('#btn-add-to-cart').on('click', function () {
                    let canAdd = true;
                    let pictureURL = book.picture._downloadURL;
                    let author = book.author;
                    let title = book.title;
                    let price = book.price;
                    let bookId = book._id;
                    let bookToPush = {};


                    booksData.getUserBooks().then(function (user) {
                        booksInCart = user.booksInCart;
                        (booksInCart).forEach(function (book) {
                            if (book.bookId === bookId) {
                                canAdd = false;
                                UTILS.addBooksToCart(booksInCart);
                                return;
                            }
                        });

                        if (canAdd) {
                            bookToPush = user.booksInCart;
                            bookToPush.push({
                                bookId,
                                author,
                                title,
                                price,
                                pictureURL
                            });
                            UTILS.addBooksToCart(booksInCart);
                            booksData.addBooksToUser(bookToPush);
                        }
                    });
                });
            });
    });



    $('#nav-btn-logout').on('click', function () {
        usersData.logout()
            .then(function () {
                location = '#/home/1';
                document.location.reload(true);
            });
    });

    $('#shopping-cart-button').on('click', function () {
        $('#shopping-cart-menu').toggleClass('hidden');
        $('.cart').toggleClass('activated');

        booksData.getUserBooks().then(function (result) {
            UTILS.addBooksToCart(result.booksInCart);

        });
    });

    $('#shopping-cart-menu').on('click', '.btn-remove', function () {
        let bookToRemoveTitle = $(this).parent().
            find($('.book-characteristics')).
            find('.book-title').text();
        let updatedBooksAfterRemoval;
        let idToRemove;

        booksData.getBookByTitle(bookToRemoveTitle)
            .then(function (result) {
                idToRemove = result[0]._id;
            })
            .then(function (res) {
                booksData.getUserBooks()
                    .then(function (userBooks) {
                        updatedBooksAfterRemoval = JSON.parse(JSON.stringify(userBooks.booksInCart));

                        (userBooks.booksInCart).forEach(function (book) {
                            if (book.bookId === idToRemove) {
                                updatedBooksAfterRemoval.splice(idToRemove, 1);
                                return;
                            }
                        });

                        return updatedBooksAfterRemoval;
                    })
                    .then(function (books) {
                        UTILS.addBooksToCart(books);
                        booksData.addBooksToUser(books);                  
                    });
            });
    });
    
    $('.dropdown-menu a').on('click', function () {
        $orderBy.html($(this).html() + '<span class="caret"></span>');
    });
});

router.run('#/home/1');
let sammyApp = {};
export { sammyApp as sammyApp };