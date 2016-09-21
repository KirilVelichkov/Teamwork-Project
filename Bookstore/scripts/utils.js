import CryptoJS from 'cryptojs';

function encryptToBase64(string){
    var toUtf8 = CryptoJS.enc.Utf8.parse(string); 
    var base64 = CryptoJS.enc.Base64.stringify(toUtf8);

    return base64;
}

function encryptToSha1(string){
    var toSha1 = CryptoJS.SHA1(string).toString();

    return toSha1;
}

function createBooksOnPage(array, pageNumber, booksOnPageCount){
    var newArray = array.slice((pageNumber - 1) * booksOnPageCount , (pageNumber - 1) * booksOnPageCount + booksOnPageCount);
    return newArray;
}

function createPageIndeces(array, booksOnPageCount){
    var totalBooks = array.length;
    var buttonsCount = Math.ceil(totalBooks / booksOnPageCount);
    var array = [];
    for(var i = 1; i <= buttonsCount; i++){
        array.push(i);
    }
    
    return array;
}

var utils = { encryptToBase64, encryptToSha1, createBooksOnPage, createPageIndeces };
export { utils as UTILS };