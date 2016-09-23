import Sammy from 'sammy';
import $ from 'jquery';
import { CONSTANTS } from 'constants';
import { UTILS } from 'utils';
import { templates } from 'templates';
import { booksData } from 'booksData';
import { usersData } from 'usersData';
import * as toastr from 'toastr';

var router = Sammy('#content', function () {
    var $content = $('#content');
    var $orderByChoice = $('#orderby > .dropdown-toggle');
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

    this.get('#/home/?:pageNumber&:orderByCode', function () {
        var pageNumber = this.params['pageNumber'];
        var orderByCode = this.params['orderByCode'] | 0;
        var totalBooks;
        var booksOnPage;
        var pageIndeces;

        UTILS.setupOrderByLinks();

        booksData.getAllBooks()
            .then(function (result) {
                result = booksData.orderBooksBy(result, orderByCode);
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

    this.get('#/home/:pageNumber', function (context) {
        var pageNum = this.params["pageNumber"];
        context.redirect(`#/home/${pageNum}&${CONSTANTS.ORDERBY.DEFAULT}`);
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
                            $('#nav-btn-logout').removeClass('hidden');
                            $('#detailed-btn').removeClass('hidden');
                            $('#shopping-cart-button').removeClass('hidden');
                            $('#nav-btn-register').addClass('hidden');
                            $('#nav-btn-login').addClass('hidden');

                            context.redirect('#/home/1');
                            toastr.success('Login successful');
                            //document.location.reload(true);
                        });
                });
            });
    });

    this.get('#/register', function (context) {
        if (usersData.current()) {
            context.redirect('#/login');
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
                            if (newUser.username.trim() === '' || newUser.password.trim() === '') {
                                toastr.error("Invalid username or password");
                            } else {
                                context.redirect('#/login');
                            }
                        });
                });
            });
    });

    this.get('#/genre-info/?:genre&:pageNumber&:orderByCode', function (context) {
        var genre = this.params['genre'];
        var pageNumber = this.params['pageNumber'];
        var orderByCode = this.params['orderByCode'] | 0;
        var category;
        var booksOnPage;
        var pageIndeces;

        UTILS.setupOrderByLinks();

        booksData.getBooksByGenre(genre)
            .then(function (result) {
                result = booksData.orderBooksBy(result, orderByCode);
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

    this.get('#/genre-info/?:genre&:pageNumber', function (context) {
        var pageNum = this.params['pageNumber'],
            genre = this.params['genre'];
        context.redirect(`#/genre-info/${genre}&${pageNum}&${CONSTANTS.ORDERBY.DEFAULT}`);
    });

    this.get('#/book-info/:title', function (context) {
        var currentTitle = this.params['title'];
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

                $('#reddit-submit').attr('href', 
                    `${$('#reddit-submit').attr('href')}&url=${encodeURIComponent(window.location.href)}`);
                
                UTILS.getShortUrl(window.location.href, function (url){
                    var shareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURI(url)}`;
                    $('#facebook-share').on('click',function () {
                        var fbpopup = window.open(shareURL, "pop", "width=600, height=400, scrollbars=no");
                        return false;
                    });
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
                                toastr.warning(`${title} - is already in the cart!`);
                                UTILS.addBooksToCart(booksInCart);
                                return;
                            }
                        });

                        if (canAdd) {
                            toastr.success(`${title} - successfully added to cart!`);
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

    this.get('#/book-info', function(context){
        var localTitle = localStorage.getItem('CURRENT_TITLE');
        context.redirect(`#/book-info/${localTitle}`);
    });


    $('#nav-btn-logout').on('click', function () {
        $('#shopping-cart-button').addClass('hidden');
        $('#nav-btn-logout').addClass('hidden');
        $('#detailed-btn').addClass('hidden');
        $('#nav-btn-logout').addClass('hidden');
        $('#nav-btn-login').removeClass('hidden');
        $('#nav-btn-register').removeClass('hidden');

        usersData.logout()
            .then(function () {

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
        $orderByChoice.html($(this).html() + '<span class="caret"></span>');
    });

    $('aside > ul.nav.nav-pills.nav-stacked > li > a').each((i, item) => {
        if (i === 0) {
        }
        else {
            item.addEventListener('click', UTILS.resetOrderByTypeOnChange);
        }
    });
});

router.run('#/home/1');
let sammyApp = {};
export { sammyApp as sammyApp };