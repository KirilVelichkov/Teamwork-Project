import $ from 'jquery';
import { CONSTANTS } from 'constants';
import { KINVEY } from 'kinvey';
import { requester } from 'requester';

class BooksData {
    constructor(urls, options, requester){
        this.urls = urls;
        this.options = options;
        this.requester = requester;
    }

    getAllBooks() {
        var url = this.urls.getAllBooksUrl();
        return this.requester.getJSON(url, this.options);
    }

    getBooksByGenre(genreName) {
        var filter = JSON.stringify({
            "genre": genreName
        });
        var url = this.urls.getBooksByGenreUrl(filter);

        return this.requester.getJSON(url, this.options);
    }

    getBookByTitle(titleName) {
        var filter = JSON.stringify({
            "title": titleName
        });
        var url = this.urls.getBookByTitleUrl(filter);

        return this.requester.getJSON(url, this.options);
    }

    searchBookByTitle(titleName) {
        var filter = JSON.stringify({
            "title": {"$regex":`^(?i)${titleName}`}
        });
        var url = this.urls.searchBookByTitleUrl(filter);

        return this.requester.getJSON(url, this.options);
    }

    searchBookByAuthor(authorName){
        var filter = JSON.stringify({
            "author": {"$regex":`^(?i)${authorName}`}
        });
        var url = this.urls.searchBookByAuthorUrl(filter);

        return this.requester.getJSON(url, this.options);
    }

    rateBookPositive(book) {
        book.rating += 1;
        $('#rating').text(book.rating);

        var url = this.urls.rateBookPositiveUrl(book);

        return this.requester.putJSON(url, book, this.options);
    }

    rateBookNegative(book) {
        book.rating -= 1;
        $('#rating').text(book.rating);

        var url = this.urls.rateBookNegativeUrl(book);

        return this.requester.putJSON(url, book, this.options);
    }

    addBooksToUser(book) {
        var userId = localStorage.getItem(CONSTANTS.USER_ID);
        var data = {
            booksInCart: book
        };
        var url = this.urls.addBooksToUserUrl(userId);
        
        return this.requester.putJSON(url, data, this.options);
    }

    getUserBooks() {
        var userId = localStorage.getItem(CONSTANTS.USER_ID);
        var url = this.urls.getUserBooksUrl(userId);
        
        return this.requester.getJSON(url, this.options);
    }

    orderBooksBy(booksCollection, code) {
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
}

let booksData = new BooksData(KINVEY.URLS, KINVEY.BOOKS_OPTIONS, requester);

export { booksData as booksData };