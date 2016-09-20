import Sammy from 'sammy';
import $ from 'jquery';
import { templates } from 'templates';
import { booksData } from 'booksData';
import { usersData } from 'usersData';

var router = Sammy('#content', function(){
    var $content = $('#content');
        
    this.get('#/', function(){
        var books;

        booksData.getAllBooks()
        .then(function(result) {
            books = result;
            return templates.get('home');
        })
        .then(function(template) {
            $content.html(template(books));

            $('.book-title').on('click', function(){
                var currentTitle = $(this).html();
                localStorage.setItem('CURRENT_TITLE', currentTitle);
            });
        });
    });

    this.get('#/login', function(context){
            if(usersData.current()){
                context.redirect('#/');
                return;
            }

        templates.get('login')
            .then(function(template){
                $content.html(template());

                $('#btn-login').on('click', function(){
                    var logUser = {
                        username : $('#tb-username').val(),
                        password: $('#tb-password').val()
                    };

                    usersData.login(logUser)
                        .then(function(response){
                            context.redirect('#/');
                            document.location.reload(true);
                        });
                });
        });
    });

    this.get('#/register', function(context){
        if(usersData.current()){
            context.redirect('#/');
            return;
        }
        templates.get('register')
            .then(function(template){
                $content.html(template());
                $('#btn-register').on('click', function(){
                    var newUser = {
                        username : $('#tb-newUsername').val(),
                        password: $('#tb-newPassword').val()
                    }

                    usersData.register(newUser)
                        .then(function(response){
                            context.redirect('#/');
                            document.location.reload(true);
                        });
                });
        });
    });
    
    this.get('#/genre-info', function(context){
        var genre = localStorage.getItem('CURRENT-GENRE');
        var category;

        booksData.getBooksByGenre(genre)
        .then(function(result) {
            category = {
                name: genre,
                books: result
            };
            return templates.get('genre');
        })
        .then(function(template) {
            $content.html(template(category));

            $('.book-title').on('click', function(){
                var currentTitle = $(this).html();
                localStorage.setItem('CURRENT_TITLE', currentTitle);
            });
        });
    });

    this.get('#/book-info', function(context){
        var currentTitle = localStorage.getItem('CURRENT_TITLE');
        var book;

        booksData.getBookByTitle(currentTitle)
        .then(function(result) {
            book = result[0];
            return templates.get('book-info');
        })
        .then(function(template) {
            $content.html(template(book));

            $('#btn-like').on('click', function(){
                booksData.rateBookPositive(book);
            });
            $('#btn-dislike').on('click', function(){
                booksData.rateBookNegative(book);
            });
        });
    });

});

if(usersData.current()){
        $('#nav-btn-login, #nav-btn-register').toggle('hidden');

    } else {
        $('#nav-btn-logout').toggle('hidden');
        $('#detailed-btn').toggle('hidden');
    }
    
$('#nav-btn-logout').on('click', function(){
    usersData.logout()
        .then(function(){
            location = '#/';
            document.location.reload(true);
        });
});

$('.genre-info').on('click', function(){
    var genreName = $(this).html();
    localStorage.setItem('CURRENT-GENRE', genreName);
    document.location.reload(true);
});
    
router.run('#/');
let sammyApp = {};
export { sammyApp as sammyApp };