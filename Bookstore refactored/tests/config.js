SystemJS.config({
    'transpiler': 'plugin-babel',
    'map': {
        'plugin-babel': '../node_modules/systemjs-plugin-babel/plugin-babel.js',
        'systemjs-babel-build': '../node_modules/systemjs-plugin-babel/systemjs-babel-browser.js',
        'jquery': '../bower_components/jquery/dist/jquery.js',
        'sammy': '../bower_components/sammy/lib/sammy.js',
        'handlebars': '../bower_components/handlebars/handlebars.js',
        'toastr': '../bower_components/toastr/toastr.js',
        'cryptojs': '../bower_components/crypto-js/crypto-js.js',

        'templates': '../scripts/helpers/templates.js',
        'constants': '../scripts//helpers/constants.js',
        'utils': '../scripts/helpers/utils.js',
        'kinvey': '../scripts/helpers/kinvey.js',

        'usersController': '../scripts/controllers/usersController.js',
        'booksController': '../scripts/controllers/booksController.js',

        'usersData': '../scripts/data/usersData.js',
        'booksData': '../scripts/data/booksData.js',

        'requester': '../scripts/requests/requester.js',

        'sammyApp': '../scripts/sammyApp.js',
        'tests': './tests.js'
    }
});

System.import('tests');
