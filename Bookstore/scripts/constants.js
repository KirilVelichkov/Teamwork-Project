const AUTH_TOKEN = 'auth-token';
const USER_NAME = 'username';
const APP_ID = "kid_By3bWKRn";
const APP_SECRET = "ce0332c5fb4a49329829175f28ab93d7";
const APP_MASTER = "6b416ca6fb6243f6a017f82516f5a79b";
const AUTORIZATION_STRING = `${APP_ID}:${APP_SECRET}`;
const AUTORIZATION_STRING_MASTER = `${APP_ID}:${APP_MASTER}`;
const USER_ID = 'user_id';
const BOOKS_IN_CART = 'books_in_cart';

let constants = {
    AUTH_TOKEN,
    USER_NAME, 
    APP_ID, 
    APP_SECRET,
    APP_MASTER, 
    AUTORIZATION_STRING, 
    AUTORIZATION_STRING_MASTER, 
    USER_ID,
    BOOKS_IN_CART
};
export { constants as CONSTANTS };