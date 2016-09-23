import $ from 'jquery';
import { CONSTANTS } from 'constants';
import { UTILS } from 'utils';
import { templates } from 'templates';

function getAllBooks() {
    return new Promise(function (resolve, reject) {
        var autorizationHeader = UTILS.encryptToBase64(CONSTANTS.AUTORIZATION_STRING_MASTER);

        $.ajax({
            url: `https://baas.kinvey.com/appdata/${CONSTANTS.APP_ID}/books/`,
            method: 'GET',
            headers: {
                'Authorization': `Basic ${autorizationHeader}`
            },
            data: JSON.stringify(),
            contentType: 'application/json',
            success: function (response) {
                resolve(response);
            }
        });

    });
}

function getBooksByGenre(genreName) {
    return new Promise(function (resolve, reject) {
        var autorizationHeader = UTILS.encryptToBase64(CONSTANTS.AUTORIZATION_STRING_MASTER);
        var filter = JSON.stringify({
            "genre": genreName
        });
        $.ajax({
            url: `https://baas.kinvey.com/appdata/${CONSTANTS.APP_ID}/books/?query=${filter}`,
            method: 'GET',
            headers: {
                'Authorization': `Basic ${autorizationHeader}`
            },
            data: JSON.stringify(),
            contentType: 'application/json',
            success: function (response) {
                resolve(response);
            }
        });
    });
}

function getBookByTitle(titleName) {
    return new Promise(function (resolve, reject) {
        var autorizationHeader = UTILS.encryptToBase64(CONSTANTS.AUTORIZATION_STRING_MASTER);
        var filter = JSON.stringify({
            "title": titleName
        });
        $.ajax({
            url: `https://baas.kinvey.com/appdata/${CONSTANTS.APP_ID}/books/?query=${filter}`,
            method: 'GET',
            headers: {
                'Authorization': `Basic ${autorizationHeader}`
            },
            data: JSON.stringify(),
            contentType: 'application/json',
            success: function (response) {
                resolve(response);
            }
        });
    });
}

function rateBookPositive(book) {
    return new Promise(function (resolve, reject) {
        var autorizationHeader = UTILS.encryptToBase64(CONSTANTS.AUTORIZATION_STRING_MASTER);
        var id = book._id;
        book.rating += 1;
        $('#rating').text(book.rating);

        $.ajax({
            url: `https://baas.kinvey.com/appdata/${CONSTANTS.APP_ID}/books/${id}`,
            method: 'PUT',
            headers: {
                'Authorization': `Basic ${autorizationHeader}`
            },
            data: JSON.stringify(book),
            contentType: 'application/json',
            success: function (response) {
                //document.location.reload(true);
                resolve(response);
            }
        });
    });
}

function rateBookNegative(book) {
    return new Promise(function (resolve, reject) {
        var autorizationHeader = UTILS.encryptToBase64(CONSTANTS.AUTORIZATION_STRING_MASTER);
        var id = book._id;
        book.rating -= 1;
        $('#rating').text(book.rating);

        $.ajax({
            url: `https://baas.kinvey.com/appdata/${CONSTANTS.APP_ID}/books/${id}`,
            method: 'PUT',
            headers: {
                'Authorization': `Basic ${autorizationHeader}`
            },
            data: JSON.stringify(book),
            contentType: 'application/json',
            success: function (response) {
                //document.location.reload(true);
                resolve(response);
            }
        });
    });
}

function addBooksToUser(book) {

    var promise = new Promise(function (resolve, reject) {
        var autorizationHeader = UTILS.encryptToBase64(CONSTANTS.AUTORIZATION_STRING_MASTER);
        var userId = localStorage.getItem(CONSTANTS.USER_ID);
        var data = {
            booksInCart: book
        };

        $.ajax({
            url: `https://baas.kinvey.com/user/${CONSTANTS.APP_ID}/${userId}`,
            method: 'PUT',
            headers: {
                'Authorization': `Basic ${autorizationHeader}`
            },
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (response) {
                resolve(response);
            }
        });
    });

    return promise;
}

function getUserBooks() {
    var promise = new Promise(function (resolve, reject) {
        var autorizationHeader = UTILS.encryptToBase64(CONSTANTS.AUTORIZATION_STRING_MASTER);
        var userId = localStorage.getItem(CONSTANTS.USER_ID);

        $.ajax({
            url: `https://baas.kinvey.com/user/${CONSTANTS.APP_ID}/${userId}`,
            method: 'GET',
            headers: {
                'Authorization': `Basic ${autorizationHeader}`
            },
            contentType: 'application/json',
            success: function (response) {
                resolve(response);
            }
        });
    });

    return promise;
}

function orderBooksBy(booksCollection, code) {
    switch(code){
        case CONSTANTS.ORDERBY.DEFAULT:
            return booksCollection;
        case CONSTANTS.ORDERBY.AUTHOR_ASC:
            return sortby(booksCollection, "author");
        case CONSTANTS.ORDERBY.AUTHOR_DESC:
            return sortby(booksCollection, "author").reverse();
        case CONSTANTS.ORDERBY.TITLE_ASC:
            return sortby(booksCollection, "title");
        case CONSTANTS.ORDERBY.TITLE_DESC:
            return sortby(booksCollection, "title").reverse();
        case CONSTANTS.ORDERBY.PRICE_ASC:
            return sortby(booksCollection, "price");
        case CONSTANTS.ORDERBY.PRICE_DESC:
            return sortby(booksCollection, "price").reverse();
        default:
            return booksCollection;

    }
    
    function sortby(booksCollection, sortBy){
        var newArr =  booksCollection.sort((a, b) => {
            var paramA = a[sortBy];
            var paramB = b[sortBy];

            if(typeof paramA === "string" &&
                typeof paramB === "string"){
                paramA = paramA.toUpperCase();
                paramB = paramB.toUpperCase();
            }
            else{
                paramA = parseFloat(paramA);
                paramB = parseFloat(paramB);
            }
            if(paramA < paramB){
                return -1;
            }
            if(paramA > paramB){
                return 1;
            }

            return 0;
        });
        return newArr;
    }

}


let booksData = {
    getAllBooks,
    getBooksByGenre,
    getBookByTitle,
    rateBookNegative,
    rateBookPositive,
    addBooksToUser,
    getUserBooks,
    orderBooksBy
};

export {booksData as booksData};