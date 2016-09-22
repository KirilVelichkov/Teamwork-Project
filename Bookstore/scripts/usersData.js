import $ from 'jquery';
import { CONSTANTS } from 'constants';
import { UTILS } from 'utils';
import { templates } from 'templates';

var login = function(logUser){
    var promise = new Promise(function(resolve, reject){
        var requestedUser = {
            username: logUser.username,
            password: UTILS.encryptToSha1(logUser.password)
        };

        var autorizationHeader = UTILS.encryptToBase64(CONSTANTS.AUTORIZATION_STRING);

        $.ajax({
            url: `https://baas.kinvey.com/user/${CONSTANTS.APP_ID}/login/`,
            method: 'POST',
            headers: {
                'Authorization': `Basic ${autorizationHeader}`
            },
            data: JSON.stringify(requestedUser),
            contentType: 'application/json',
            success: function(response){
                localStorage.setItem(CONSTANTS.AUTH_TOKEN, response._kmd.authtoken);
                localStorage.setItem(CONSTANTS.USER_NAME, response.username);
                localStorage.setItem(CONSTANTS.USER_ID, response._id);
                
                resolve(response);
            }
        });
    }); 

    return promise;
};

var register = function(newUser){
    var promise = new Promise(function(resolve, reject){
        var requestedUser = {
            username: newUser.username,
            password: UTILS.encryptToSha1(newUser.password),
            booksInCart: []
        };

        var autorizationHeader = UTILS.encryptToBase64(CONSTANTS.AUTORIZATION_STRING);

        $.ajax({
            url: `https://baas.kinvey.com/user/${CONSTANTS.APP_ID}/`,
            method: 'POST',
            headers: {
                'Authorization': `Basic ${autorizationHeader}`
            },
            data: JSON.stringify(requestedUser),
            contentType: 'application/json',
            success: function(response){
                resolve(response);
            }
        });
    }); 

    return promise;
};

var logout = function(){
    var promise = new Promise(function (resolve, reject){
        localStorage.removeItem(CONSTANTS.AUTH_TOKEN);
        localStorage.removeItem(CONSTANTS.USER_NAME);
        localStorage.removeItem(CONSTANTS.USER_ID);
        resolve();
    });

    return promise;
};

var current = function(){
    var username = localStorage.getItem(CONSTANTS.USER_NAME);
    var token = localStorage.getItem(CONSTANTS.AUTH_TOKEN);
    var user_id = localStorage.getItem(CONSTANTS.USER_ID);
    
    if(!username){
        return null;
    } else {
        return {
            username: username,
            token: token,
            user_id: user_id
        };
    }   
};

let usersData = { login, register, logout, current };
export { usersData as usersData };
