import $ from 'jquery';
import { CONSTANTS } from 'constants';
import { UTILS } from 'utils';
import { KINVEY } from 'kinvey';
import { requester } from 'requester';

class UsersData {
    constructor(urls, options){
        this.urls = urls;
        this.options = options;
        this.requester = requester;
    }

    login(logUser) {
        var requestedUser = {
            username: logUser.username,
            password: UTILS.encryptToSha1(logUser.password)
        };
        var url = this.urls.getLoginUrl();

        return this.requester.postJSON(url, requestedUser, this.options);
    }

    register(newUser) {
        var requestedUser = {
                username: newUser.username,
                password: UTILS.encryptToSha1(newUser.password),
                booksInCart: []
            };
        var url = this.urls.getRegisterUrl();
        
        return this.requester.postJSON(url, requestedUser, this.options);
    }

    logout() {
        return new Promise(function (resolve) {
            resolve();
        });
    }
}

let usersData = new UsersData(KINVEY.URLS, KINVEY.USERS_OPTIONS, requester);
export { usersData as usersData };
