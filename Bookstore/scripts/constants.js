const AUTH_TOKEN = 'auth-token';
const USER_NAME = 'username';
const APP_ID = "kid_By3bWKRn";
const APP_SECRET = "ce0332c5fb4a49329829175f28ab93d7";
const APP_MASTER = "6b416ca6fb6243f6a017f82516f5a79b";
const AUTORIZATION_STRING = `${APP_ID}:${APP_SECRET}`;
const AUTORIZATION_STRING_MASTER = `${APP_ID}:${APP_MASTER}`;
const USER_ID = 'user_id';
const BOOKS_IN_CART = 'books_in_cart';
const PAGE_SIZE_BIG = 8;
const PAGE_SIZE_SMALL = 4;
const BITLY_AUTHORIZATION = {
    LOGIN: 'o_2a2sif2071',
    API_KEY: 'R_dd5f34358ad045f2aea412536f38b2e5'
};
const ORDERBY = {
    DEFAULT: 0,
    AUTHOR_ASC: 1,
    AUTHOR_DESC: 2,
    TITLE_ASC: 3,
    TITLE_DESC: 4,
    PRICE_ASC: 5,
    PRICE_DESC: 6
};

let constants = {
    AUTH_TOKEN,
    USER_NAME, 
    APP_ID, 
    APP_SECRET,
    APP_MASTER, 
    AUTORIZATION_STRING, 
    AUTORIZATION_STRING_MASTER, 
    USER_ID,
    BOOKS_IN_CART,
    PAGE_SIZE_BIG,
    PAGE_SIZE_SMALL,
    ORDERBY,
    BITLY_AUTHORIZATION
};
export { constants as CONSTANTS };