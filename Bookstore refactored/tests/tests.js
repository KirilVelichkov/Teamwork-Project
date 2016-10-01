import { usersData } from 'usersData';
import { requester } from 'requester';
import { usersController} from 'usersController';

mocha.setup('bdd');

let expect = chai.expect;

const LOGIN_URL = 'https://baas.kinvey.com/user/kid_By3bWKRn/login/';
const REGISTER_URL = 'https://baas.kinvey.com/user/kid_By3bWKRn/';
const user = {
    username: 'test2',
    password: 'test2'
};


describe('User Tests', function () {

    describe('usersData.login() tests', function () {

        beforeEach(function () {
            sinon.stub(requester, 'postJSON', function (user) {
                return new Promise(function (resolve, reject) {
                    resolve(user);
                });
            });
            localStorage.clear();
        });

        afterEach(function () {
            requester.postJSON.restore();
            localStorage.clear();
        });

        it('(1) Expect: usersData.login() to make correct postJSON call', function (done) {
            usersData.login(user)
                .then(() => {
                    expect(requester.postJSON.firstCall.args[0]).to.equal(LOGIN_URL);
                })
                .then(done, done);
        });

        it('(2) Expect: usersData.login() to make exactly one postJSON call', function (done) {
            usersData.login(user)
                .then(() => {
                    expect(requester.postJSON.calledOnce).to.be.true;
                })
                .then(done, done);
        });

        it('(3) Expect: usersData.login() to put correct user data', function (done) {
            usersData.login(user)
                .then(() => {
                    const actual = requester.postJSON.firstCall.args[1];
                    const props = Object.keys(actual).sort();

                    expect(props.length).to.equal(2);
                    expect(props[0]).to.equal('password');
                    expect(props[1]).to.equal('username');
                })
                .then(done, done);
        });

    });

    describe('usersData.register() tests', function () {
        beforeEach(function () {
            sinon.stub(requester, 'postJSON', function (user) {
                return new Promise(function (resolve, reject) {
                    resolve(user);
                });
            });
        });

        afterEach(function () {
            requester.postJSON.restore();
        });


        it('(1) Expect: usersData.register() to make correct postJSON call', function (done) {
            usersData.register(user)
                .then(() => {
                    expect(requester.postJSON.firstCall.args[0]).to.equal(REGISTER_URL);
                })
                .then(done, done);
        });

        it('(2) Expect: usersData.register() to make exactly one postJSON call', function (done) {
            usersData.register(user)
                .then((res) => {              
                    expect(requester.postJSON.calledOnce).to.be.true;
                })
                .then(done, done);
        });

        it('(3) Expect: usersData.login() to put correct user data', function (done) {
            usersData.register(user)
                .then(() => {
                    const actual = requester.postJSON.firstCall.args[1];
                    const props = Object.keys(actual).sort();

                    expect(props.length).to.equal(3);
                    expect(props[0]).to.equal('booksInCart');
                    expect(props[1]).to.equal('password');
                    expect(props[2]).to.equal('username');
                })
                .then(done, done);
        });
        
    });

});

mocha.run();