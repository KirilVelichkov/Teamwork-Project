import $ from 'jquery';
import CryptoJS from 'cryptojs';
import { CONSTANTS } from 'constants';
import { templates } from 'templates';

function encryptToBase64(string) {
    var toUtf8 = CryptoJS.enc.Utf8.parse(string);
    var base64 = CryptoJS.enc.Base64.stringify(toUtf8);

    return base64;
}

function encryptToSha1(string) {
    var toSha1 = CryptoJS.SHA1(string).toString();

    return toSha1;
}

function createBooksOnPage(array, pageNumber, booksOnPageCount) {
    var newArray = array.slice((pageNumber - 1) * booksOnPageCount, (pageNumber - 1) * booksOnPageCount + booksOnPageCount);
    return newArray;
}

function createPageIndeces(array, booksOnPageCount) {
    var totalBooks = array.length;
    var buttonsCount = Math.ceil(totalBooks / booksOnPageCount);
    var array = [];
    for (var i = 1; i <= buttonsCount; i++) {
        array.push(i);
    }

    return array;
}

function addBooksToCart(books) {
    let templateToParse,
        totalPrice = 0;

    books.forEach(function (book) {
        totalPrice += book.price;
    });
    totalPrice = parseFloat(totalPrice.toString()).toFixed(2);
    templateToParse = {
        books,
        totalPrice
    };

    templates.getTemplate('shopping-cart-menu').then((template) => {
        $('#shopping-cart-menu').html(template(templateToParse));
    });
}

function setupOrderByLinks() {
    let orderByLinks = $('#orderby > ul.dropdown-menu > li > a');
    orderByLinks.each((i, link) => {
        var url = window.location
            .toString()
            .substr(0, window.location.toString().length - 1) + i;

        link.href = url;
    });
}

function fixPaginationForOrderBy(orderByCode) {
    $('.btn.btn-primary.btn-page').each(function (i, btn) {
        btn.href += `&${orderByCode}`;
    });
}

function resetOrderByTypeOnChange() {
    $('#orderby > .dropdown-toggle').html('Default <span class="caret"></span>');
}

function getShortUrl(longUrl, func) {
    $.getJSON(
        "https://api-ssl.bitly.com/v3/shorten?callback=?",
        {
            "format": "json",
            "apiKey": CONSTANTS.BITLY_AUTHORIZATION.API_KEY,
            "login": CONSTANTS.BITLY_AUTHORIZATION.LOGIN,
            "longUrl": longUrl
        },
        function (response) {
            func(response.data.url);
        }
    );
}

function isUserLoggedIn(){
    var username = localStorage.getItem(CONSTANTS.USER_NAME);

    if (!username) {
        return false;
    } else {
        return true;
    }
}

function showFilters(){
    $('#filters').removeClass('hidden');
}

function hideFilters(){
    $('#filters').addClass('hidden');
}

var utils = {
    encryptToBase64,
    encryptToSha1,
    createBooksOnPage,
    createPageIndeces,
    addBooksToCart,
    setupOrderByLinks,
    resetOrderByTypeOnChange,
    getShortUrl,
    fixPaginationForOrderBy,
    isUserLoggedIn,
    showFilters,
    hideFilters
};

export { utils as UTILS };