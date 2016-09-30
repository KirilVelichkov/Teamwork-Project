const AUTH_TOKEN = 'auth-token';
const USER_NAME = 'username';
const USER_ID = 'user_id';
const BOOKS_IN_CART = 'books_in_cart';
const PAGE_SIZE_BIG = 8;
const PAGE_SIZE_SMALL = 4;
const BITLY_AUTHORIZATION = {
    LOGIN: 'o_2a2sif2071',
    API_KEY: 'R_dd5f34358ad045f2aea412536f38b2e5'
};
const USERNAME_MIN_LENGTH = 3;
const PASSWORD_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 20;
const PASSWORD_MAX_LENGTH = 20;

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
    USER_ID,
    BOOKS_IN_CART,
    PAGE_SIZE_BIG,
    PAGE_SIZE_SMALL,
    ORDERBY,
    BITLY_AUTHORIZATION,
    USERNAME_MIN_LENGTH,
    USERNAME_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
    PASSWORD_MAX_LENGTH
};

export { constants as CONSTANTS };