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
        $('#nav-btn-login, #nav-btn-register').addClass('hidden');
        $('#shopping-cart-button').removeClass('hidden');
        $('#nav-btn-logout').removeClass('hidden');
        // $('#detailed-btn').removeClass('hidden');
    } else {
        $('#nav-btn-login, #nav-btn-register').removeClass('hidden');
        $('#shopping-cart-button').addClass('hidden');
        $('#nav-btn-logout').addClass('hidden');
        // $('#detailed-btn').addClass('hidden');
    }

    this.get('/#/', function (context) {
        context.redirect('#/home/1&0');
    });

    this.get('#/home/?:pageNumber&:orderByCode', function (context) {
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
                $('#filters').removeClass('hidden');
                UTILS.fixPaginationForOrderBy(orderByCode);
            });

        $('#search-btn').on('click', function () {
            var searchQuery = $('#search-input').val();
            $('#search-input').val("");

            context.redirect(`#/search/${searchQuery}&${pageNumber}&${orderByCode}`);
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
                $('#filters').addClass('hidden');

                $('#btn-login').on('click', function () {
                    var logUser = {
                        username: $('#tb-username').val(),
                        password: $('#tb-password').val()
                    };

                    usersData.login(logUser)
                        .then(function (response) {
                            $('#nav-btn-logout').removeClass('hidden');
                            //$('#detailed-btn').removeClass('hidden');
                            $('#shopping-cart-button').removeClass('hidden');
                            $('#nav-btn-register').addClass('hidden');
                            $('#nav-btn-login').addClass('hidden');

                            toastr.success('Login successful');
                            context.redirect('#/home/1');
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
                $('#filters').addClass('hidden');

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
                $('#filters').removeClass('hidden');
                UTILS.fixPaginationForOrderBy(orderByCode);

            });
    });

    this.get('#/genre-info/?:genre&:pageNumber', function (context) {
        var pageNum = this.params['pageNumber'],
            genre = this.params['genre'];
        context.redirect(`#/genre-info/${genre}&${pageNum}&${CONSTANTS.ORDERBY.DEFAULT}`);
    });


    this.get('#/search/?:query&:pageNumber&:orderByCode', function (context) {
        var query = this.params['query'];
        var pageNumber = this.params['pageNumber'];
        var orderByCode = this.params['orderByCode'] | 0;

        var category;
        var booksOnPage;
        var pageIndeces;

        UTILS.setupOrderByLinks();

        //Promise.all([booksData.searchBookByTitle(query),booksData.searchBookByAuthor(query)])
        booksData.getAllBooks()
            .then((results) => {
                console.log(results);
                let titleResults = [];
                let authorResults = [];
            
                results.forEach(function (item) {
                    if ((item.title.toLowerCase()).indexOf(query.toLowerCase()) != -1) {
                        titleResults.push(item);
                    }
                    if ((item.author.toLowerCase()).indexOf(query.toLowerCase()) != -1) {
                        authorResults.push(item);
                    }
                });

                titleResults.push.apply(titleResults, authorResults);
                let result = titleResults;
                booksOnPage = UTILS.createBooksOnPage(result, pageNumber, CONSTANTS.PAGE_SIZE_SMALL);
                pageIndeces = UTILS.createPageIndeces(result, CONSTANTS.PAGE_SIZE_SMALL);

                category = {
                    title: query,
                    books: booksOnPage,
                    indeces: pageIndeces
                };

                return templates.get('search-by-info');
            })
            .then(function (template) {
                $content.html(template(category));
                $('#filters').removeClass('hidden');
                UTILS.fixPaginationForOrderBy(orderByCode);
            });
    });

    this.get('#/book-info/:title', function () {
        var currentTitle = this.params['title'];
        var book;

        booksData.getBookByTitle(currentTitle)
            .then(function (result) {
                book = result[0];
                return templates.get('book-info');
            })
            .then(function (template) {
                $content.html(template(book));
                $('#filters').addClass('hidden');

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

                UTILS.getShortUrl(window.location.href, function (url) {
                    var shareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURI(url)}`;
                    $('#facebook-share').on('click', function () {
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

    this.get('#/checkout', function () {
        $('#shopping-cart-menu').addClass('hidden');
        $('.cart').toggleClass('activated');
        var books;

        booksData.getUserBooks()
            .then(function (result) {
                let totalPrice = 0;

                (result.booksInCart).forEach(function (book) {
                    totalPrice += book.price;
                });
                totalPrice = parseFloat(totalPrice.toString()).toFixed(2);

                books = {
                    allBooks: result.booksInCart,
                    totalPrice : totalPrice
                };

                return templates.get('checkout');
            })
            .then(function (template) {
                $content.html(template(books));
            });
    });

    $('#nav-btn-logout').on('click', function () {
        $('#shopping-cart-button').addClass('hidden');
        $('#nav-btn-logout').addClass('hidden');
        //$('#detailed-btn').addClass('hidden');
        $('#nav-btn-logout').addClass('hidden');
        $('#nav-btn-login').removeClass('hidden');
        $('#nav-btn-register').removeClass('hidden');
        $('#shopping-cart-menu').addClass('hidden');
        $('.cart').toggleClass('activated');

        usersData.logout();
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