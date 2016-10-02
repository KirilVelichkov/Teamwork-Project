import Sammy from 'sammy';
import $ from 'jquery';
import * as toastr from 'toastr';
import { CONSTANTS } from 'constants';
import { UTILS } from 'utils';
import { usersController } from 'usersController';
import { booksController } from 'booksController';



var router = Sammy('#content', function () {
    var $content = $('#content');
    var $orderByChoice = $('#orderby > .dropdown-toggle');
    var booksInCart = [];
    toastr.options.preventDuplicates = true;
    toastr.options.timeOut = 50;

    if (UTILS.isUserLoggedIn()) {
        $('#nav-btn-login, #nav-btn-register').addClass('hidden');
        $('#shopping-cart-button').removeClass('hidden');
        $('#nav-btn-logout').removeClass('hidden');
    } else {
        $('#nav-btn-login, #nav-btn-register').removeClass('hidden');
        $('#shopping-cart-button').addClass('hidden');
        $('#nav-btn-logout').addClass('hidden');
    }

    this.get('#/', function (context) {
        context.redirect('#/home/1&0');
    });
    
    this.get('#/home/?:pageNumber&:orderByCode', function (context) {
        var pageNumber = this.params['pageNumber'];
        var orderByCode = this.params['orderByCode'] | 0;

        booksController.home($content, pageNumber, orderByCode);       
    });

    this.get('#/login', function (context) {
        usersController.loadLoginForm($content, context);
    });

    this.get('#/register', function (context) {
        usersController.loadRegisterForm($content, context);
    });

    this.get('#/genre-info/?:genre&:pageNumber&:orderByCode', function (context) {
        var genre = this.params['genre'];
        var pageNumber = this.params['pageNumber'];
        var orderByCode = this.params['orderByCode'] | 0;
        
        booksController.genreInfo($content, genre, pageNumber, orderByCode);
    });

    this.get('#/genre-info/?:genre&:pageNumber', function (context) {
        var pageNum = this.params['pageNumber'];
        var genre = this.params['genre'];
        context.redirect(`#/genre-info/${genre}&${pageNum}&${CONSTANTS.ORDERBY.DEFAULT}`);
    });

    this.get('#/search/?:query&:pageNumber&:orderByCode', function (context) {
        var query = this.params['query'];
        var pageNumber = this.params['pageNumber'];
        var orderByCode = this.params['orderByCode'] | 0;

        
        booksController.search($content, query, pageNumber, orderByCode);
    });

    this.get('#/book-info/:title', function () {
        var currentTitle = this.params['title'];
        
        booksController.bookInfo($content, currentTitle);
    });

    this.get('#/checkout', function () {
        booksController.checkout($content);
    });

    $('#nav-btn-logout').on('click', function () {
        $('#shopping-cart-button').addClass('hidden');
        $('#nav-btn-logout').addClass('hidden');
        $('#nav-btn-logout').addClass('hidden');
        $('#nav-btn-login').removeClass('hidden');
        $('#nav-btn-register').removeClass('hidden');
        $('#shopping-cart-menu').addClass('hidden');
        $('.cart').toggleClass('activated');

        usersController.logoutUser();
    });

    $('#shopping-cart-button').on('click', function () {
        $('#shopping-cart-menu').toggleClass('hidden');
        $('.cart').toggleClass('activated');

        booksController.booksData.getUserBooks()
            .then(function (result) {
                UTILS.addBooksToCart(result.booksInCart);
            });
    });

    $('#shopping-cart-menu').on('click', '.btn-remove', function () {
        let bookToRemoveTitle = $(this).parent()
            .find($('.book-characteristics'))
            .find('.book-title').text();
        let updatedBooksAfterRemoval;
        let idToRemove;

        $(this).parents('li').eq(0).fadeOut('slow');

        booksController.booksData.getBookByTitle(bookToRemoveTitle)
            .then(function(result){
                idToRemove = result[0]._id;
            })
            .then(function(){
                return booksController.booksData.getUserBooks();
            })
            .then(function(userBooks) {
                updatedBooksAfterRemoval = JSON.parse(JSON.stringify(userBooks.booksInCart));
                for(var i = 0; i < userBooks.booksInCart.length; i += 1){
                    var currentBook = userBooks.booksInCart[i];
                    if (currentBook.bookId === idToRemove) {
                        updatedBooksAfterRemoval.splice(i, 1);
                        break;
                    }
                }

                return updatedBooksAfterRemoval;
            })
            .then(function(books) {
                UTILS.addBooksToCart(books);
                booksController.booksData.addBooksToUser(books);
            });
    });

    $('.dropdown-menu a').on('click', function () {
        $orderByChoice.html($(this).html() + '<span class="caret"></span>');
    });

    $('#navbar-brand-id').on('click', function(){
        UTILS.resetOrderByTypeOnChange();
    });

   $('aside > ul.nav.nav-pills.nav-stacked > li > a').each((i, item) => {
        if (i !== 0) {
            item.addEventListener('click', UTILS.resetOrderByTypeOnChange);
        }
    });

    $('#search-btn').on('click', function () {
        var searchQuery = $('#search-input').val();
        $('#search-input').val("");
        UTILS.resetOrderByTypeOnChange();
        
        window.location.replace(`#/search/${searchQuery}&1&0`);
    });

    $('#search-input').keyup(function(e){
        if(e.keyCode === 13){
            $('#search-btn').trigger('click');
        }
    });

});

router.run('#/');
let sammyApp = {};
export { sammyApp as sammyApp };