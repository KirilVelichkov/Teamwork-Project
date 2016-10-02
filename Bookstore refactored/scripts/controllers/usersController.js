import $ from 'jquery';
import toastr from 'toastr';
import { CONSTANTS } from 'constants';
import { usersData } from 'usersData';
import { templates } from 'templates';
import { UTILS } from 'utils';


class UsersController {
    constructor(usersData, templates){
        this.usersData = usersData;
        this.templates = templates;       
    }

    loadLoginForm(content, context){
        var $content = content;
        var _this = this;
        this.templates.getTemplate('login')
            .then(function(responseTemplate){
                $content.html(responseTemplate());
                UTILS.hideFilters();

                $('#btn-login').on('click', function () {
                    var logUser = {
                        username: $('#tb-username').val(),
                        password: $('#tb-password').val()
                    };

                    _this.loginUser(logUser, context); 
                });
            });
    }
    
    loginUser(logUser, context){
        this.usersData.login(logUser)
            .then(function(response) {
                $('#nav-btn-logout').removeClass('hidden');
                $('#shopping-cart-button').removeClass('hidden');
                $('#nav-btn-register').addClass('hidden');
                $('#nav-btn-login').addClass('hidden');

                localStorage.setItem(CONSTANTS.AUTH_TOKEN, response._kmd.authtoken);
                localStorage.setItem(CONSTANTS.USER_NAME, response.username);
                localStorage.setItem(CONSTANTS.USER_ID, response._id);

                toastr.success('Login successful!');
                context.redirect('#/home/1&0');
            }, function(error){
                toastr.error('Invalid username or password!');
                context.redirect('#/login');    
            });
    }

    loadRegisterForm(content, context){
        var $content = content;
        var _this = this;
        this.templates.getTemplate('register')
            .then(function(responseTemplate){
                $content.html(responseTemplate());
                UTILS.hideFilters();

                $('#btn-register').on('click', function () {
                    var newUser = {
                        username: $('#tb-newUsername').val(),
                        password: $('#tb-newPassword').val()
                    };

                    if(newUser.username.length < CONSTANTS.USERNAME_MIN_LENGTH || newUser.username.length > CONSTANTS.USERNAME_MAX_LENGTH){
                        toastr.error('Username must be between 3 and 20 symbols');
                        return;
                    }
                    if(newUser.password.length < CONSTANTS.PASSWORD_MIN_LENGTH || newUser.password.length > CONSTANTS.PASSWORD_MAX_LENGTH){
                        toastr.error('Password must be between 3 and 20 symbols');
                        return;
                    }
                    if(/\W+/.test(newUser.username)){
                        toastr.error('Username contains invalid symbols');
                        return;
                    }
                    if(/\W+/.test(newUser.password)){
                        toastr.error('Password contains invalid symbols');
                        return;
                    }

                    _this.registerUser(newUser, context);
                });
            });
    }
    
    registerUser(newUser, context){
        this.usersData.register(newUser)
            .then(function(response) {
                    toastr.success('Register successful. You may now login!');
                    context.redirect('#/login');
                }, function(error){
                    toastr.error('Register unsuccessful!');
                    context.redirect('#/register');
                });
    }

    logoutUser(){
        this.usersData.logout()
            .then(function(){
                var msg = `${localStorage.getItem(CONSTANTS.USER_NAME)} logged out successfuly!`;
                localStorage.removeItem(CONSTANTS.AUTH_TOKEN);
                localStorage.removeItem(CONSTANTS.USER_NAME);
                localStorage.removeItem(CONSTANTS.USER_ID);
                toastr.success(msg);
            });
    }
}

let usersController = new UsersController(usersData, templates);
export { usersController as usersController };