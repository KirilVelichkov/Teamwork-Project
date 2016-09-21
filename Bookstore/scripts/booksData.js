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

// function addBookToCart(book) {
    
//     var promise = new Promise(function (resolve, reject) {
//         var autorizationHeader = UTILS.encryptToBase64(CONSTANTS.AUTORIZATION_STRING_MASTER);
//         var userId = localStorage.getItem(CONSTANTS.USER_ID);

//         getUserBooks().then(function (books) {
//             var data = {
//                 booksInCart: books
//             };
//             data.booksInCart.push(book);
//             $.ajax({
//                 url: `https://baas.kinvey.com/user/${CONSTANTS.APP_ID}/${userId}`,
//                 method: 'PUT',
//                 headers: {
//                     'Authorization': `Basic ${autorizationHeader}`
//                 },
//                 data: JSON.stringify(data),
//                 contentType: 'application/json',
//                 success: function (response) {
//                     resolve(response);
//                 }
//             });
//         });
//     });

//     return promise;
// }

// function getUserBooks() {
//     var promise = new Promise(function (resolve, reject) {
//         var autorizationHeader = UTILS.encryptToBase64(CONSTANTS.AUTORIZATION_STRING_MASTER);
//         var userId = localStorage.getItem(CONSTANTS.USER_ID);

//         $.ajax({
//             url: `https://baas.kinvey.com/user/${CONSTANTS.APP_ID}/${userId}`,
//             method: 'GET',
//             headers: {
//                 'Authorization': `Basic ${autorizationHeader}`
//             },
//             contentType: 'application/json',
//             success: function (response) {
//                 localStorage.setItem(CONSTANTS.BOOKS_IN_CART, response.booksInCart);
//                 resolve(response.booksInCart);
//             }
//         });
//     });

//     return promise;
// }

let booksData = {
    getAllBooks,
    getBooksByGenre,
    getBookByTitle,
    rateBookNegative,
    rateBookPositive
};

export {booksData as booksData};