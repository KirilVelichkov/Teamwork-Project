import { UTILS } from 'utils';

const APP_ID = "kid_By3bWKRn";
const APP_SECRET = "ce0332c5fb4a49329829175f28ab93d7";
const APP_MASTER = "6b416ca6fb6243f6a017f82516f5a79b";
const AUTORIZATION_STRING = `${APP_ID}:${APP_SECRET}`;
const AUTORIZATION_STRING_MASTER = `${APP_ID}:${APP_MASTER}`;
const AUTORIZATION_HEADER_BOOKS = UTILS.encryptToBase64(AUTORIZATION_STRING_MASTER);
const AUTORIZATION_HEADER_USERS = UTILS.encryptToBase64(AUTORIZATION_STRING);

function getAllBooksUrl(){
    return `https://baas.kinvey.com/appdata/${APP_ID}/books/`;
}

function getBooksByGenreUrl(filter){
    return `https://baas.kinvey.com/appdata/${APP_ID}/books/?query=${filter}`;
}   

function getBookByTitleUrl(filter){
    return `https://baas.kinvey.com/appdata/${APP_ID}/books/?query=${filter}`;
} 

function searchBookByTitleUrl(filter){
    return `https://baas.kinvey.com/appdata/${APP_ID}/books/?query=${filter}`;
}

function searchBookByAuthorUrl(filter){
    return `https://baas.kinvey.com/appdata/${APP_ID}/books/?query=${filter}`;
}

function rateBookPositiveUrl(book){
    return `https://baas.kinvey.com/appdata/${APP_ID}/books/${book._id}`;
}

function rateBookNegativeUrl(book){
    return `https://baas.kinvey.com/appdata/${APP_ID}/books/${book._id}`;
}

function addBooksToUserUrl(userId){
    return `https://baas.kinvey.com/user/${APP_ID}/${userId}`;
}

function getUserBooksUrl(userId){
    return `https://baas.kinvey.com/user/${APP_ID}/${userId}`;
}

function getLoginUrl(){
    return `https://baas.kinvey.com/user/${APP_ID}/login/`;
}

function getRegisterUrl(){
    return `https://baas.kinvey.com/user/${APP_ID}/`;
}


let URLS = {
    getAllBooksUrl: getAllBooksUrl,
    getBooksByGenreUrl: getBooksByGenreUrl,
    getBookByTitleUrl: getBookByTitleUrl,
    searchBookByTitleUrl: searchBookByTitleUrl,
    searchBookByAuthorUrl: searchBookByAuthorUrl,
    rateBookPositiveUrl: rateBookPositiveUrl,
    rateBookNegativeUrl: rateBookNegativeUrl,
    addBooksToUserUrl: addBooksToUserUrl,
    getUserBooksUrl: getUserBooksUrl,

    getLoginUrl: getLoginUrl,
    getRegisterUrl: getRegisterUrl
};

let BOOKS_OPTIONS = {
    headers: {
        'Authorization': `Basic ${AUTORIZATION_HEADER_BOOKS}`
    }
};

let USERS_OPTIONS = {
    headers: {
        'Authorization': `Basic ${AUTORIZATION_HEADER_USERS}`
    }
};

let kinvey = {
    URLS: URLS,
    BOOKS_OPTIONS: BOOKS_OPTIONS,
    USERS_OPTIONS: USERS_OPTIONS
};

export { kinvey as KINVEY };

