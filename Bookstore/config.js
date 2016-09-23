SystemJS.config({
    'transpiler': 'plugin-babel',
    'map': {
        'plugin-babel': './node_modules/systemjs-plugin-babel/plugin-babel.js',
        'systemjs-babel-build': './node_modules/systemjs-plugin-babel/systemjs-babel-browser.js',
        'jquery': './bower_components/jquery/dist/jquery.js',
        'sammy': './bower_components/sammy/lib/sammy.js',
        'handlebars': './bower_components/handlebars/handlebars.js',
        'cryptojs': './bower_components/crypto-js/crypto-js.js',
        'templates': './scripts/templates.js',
        'usersData': './scripts/usersData.js',
        'booksData': './scripts/booksData.js',
        'constants': './scripts/constants.js',
        'utils': './scripts/utils.js',
        'sammyApp': './scripts/sammyApp.js',
        'toastr':'./bower_components/toastr/toastr.js'
        
    }
});

System.import('sammyApp');