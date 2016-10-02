import $ from 'jquery';
import toastr from 'toastr';
import { UTILS } from 'utils';
import { CONSTANTS } from 'constants';
import { booksData } from 'booksData';
import { templates } from 'templates';

class BooksConroller {
    constructor(booksData, templates){
        this.booksData = booksData;
        this.temlpates = templates;
    }

    home(content, pageNumberParam, orderByCodeParam){
        var $content = content;
        var _this = this;
        var pageNumber = pageNumberParam;
        var orderByCode = orderByCodeParam;
        var totalBooks;
        var booksOnPage;
        var pageIndeces;
        
        UTILS.setupOrderByLinks();

        _this.booksData.getAllBooks()
            .then(function(result) {
                result = _this.booksData.orderBooksBy(result, orderByCode);
                booksOnPage = UTILS.createBooksOnPage(result, pageNumber, CONSTANTS.PAGE_SIZE_BIG);
                pageIndeces = UTILS.createPageIndeces(result, CONSTANTS.PAGE_SIZE_BIG);
                totalBooks = {
                    books: booksOnPage,
                    indeces: pageIndeces
                };

                return templates.getTemplate('home');
            })
            .then(function (template) {
                $content.html(template(totalBooks));
                UTILS.showFilters()
                UTILS.fixPaginationForOrderBy(orderByCode);
            });
    }

    genreInfo(content, genre, pageNumber, orderByCode){
        var $content = content;
        var _this = this;
        var category;
        var booksOnPage;
        var pageIndeces;

        UTILS.setupOrderByLinks();

        _this.booksData.getBooksByGenre(genre)
            .then(function (result) {
                result = _this.booksData.orderBooksBy(result, orderByCode);
                booksOnPage = UTILS.createBooksOnPage(result, pageNumber, CONSTANTS.PAGE_SIZE_SMALL);
                pageIndeces = UTILS.createPageIndeces(result, CONSTANTS.PAGE_SIZE_SMALL);

                category = {
                    name: genre,
                    books: booksOnPage,
                    indeces: pageIndeces
                };

                return templates.getTemplate('genre-info');
            })
            .then(function (template) {
                $content.html(template(category));
                UTILS.showFilters()
                UTILS.fixPaginationForOrderBy(orderByCode);
            });
    }

    search(content, query, pageNumber, orderByCode){
        var $content = content;
        var _this = this;
        var seachResult;
        var booksOnPage;
        var pageIndeces;

        UTILS.setupOrderByLinks();

        _this.booksData.getAllBooks()
            .then((results) => {
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
        
                result = _this.booksData.orderBooksBy(result, orderByCode);
                booksOnPage = UTILS.createBooksOnPage(result, pageNumber, CONSTANTS.PAGE_SIZE_SMALL);
                pageIndeces = UTILS.createPageIndeces(result, CONSTANTS.PAGE_SIZE_SMALL);

                seachResult = {
                    title: query,
                    books: booksOnPage,
                    indeces: pageIndeces
                };

                return templates.getTemplate('search-by-info');
            })
            .then(function (template) {
                $content.html(template(seachResult));
                UTILS.showFilters()
                UTILS.fixPaginationForOrderBy(orderByCode);
            });
    }

    bookInfo(content, currentTitle){
        var $content = content;
        var _this = this;
        var book;
        
        _this.booksData.getBookByTitle(currentTitle)
            .then(function (result) {
                book = result[0];
                return templates.getTemplate('book-info');
            })
            .then(function (template) {
                $content.html(template(book));
                UTILS.hideFilters()

                if (UTILS.isUserLoggedIn()) {
                    $('#btn-like').removeClass('hidden');
                    $('#btn-dislike').removeClass('hidden');
                    $('#btn-add-to-cart').removeClass('hidden');
                } else {
                    $('#btn-like').addClass('hidden');
                    $('#btn-dislike').addClass('hidden');
                    $('#btn-add-to-cart').addClass('hidden');
                }

                $('#btn-like').on('click', function () {
                    _this.booksData.rateBookPositive(book);
                });

                $('#btn-dislike').on('click', function () {
                    _this.booksData.rateBookNegative(book);
                });

                $('#reddit-submit').attr('href', `${$('#reddit-submit').attr('href')}&url=${encodeURIComponent(window.location.href)}`);
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
                    let booksInCart = [];
                    
                    _this.booksData.getUserBooks()
                        .then(function(user) {
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
                            _this.booksData.addBooksToUser(bookToPush);
                        }
                    });
                });
            });
    }

    checkout(content){
        var $content = content;
        var _this = this;

        $('#shopping-cart-menu').addClass('hidden');
        $('.cart').toggleClass('activated');
        var books;

        _this.booksData.getUserBooks()
            .then(function(result) {
                let totalPrice = 0;

                (result.booksInCart).forEach(function (book) {
                    totalPrice += book.price;
                });
                totalPrice = parseFloat(totalPrice.toString()).toFixed(2);

                books = {
                    allBooks: result.booksInCart,
                    totalPrice : totalPrice
                };

                return templates.getTemplate('checkout');
            })
            .then(function(template) {
                $content.html(template(books));
                UTILS.hideFilters();
            });
    }
}

let booksController = new BooksConroller(booksData, templates);
export { booksController as booksController };