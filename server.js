var hapi    = require('hapi');
var server  = new hapi.Server();
var routes  = require('./routes');
var vision  = require('vision');  // for view
var inert   = require('inert');   // to serve static files



server.connection({
    port:3000,
    host:'localhost'
});

//register a plugin
server.register([vision,inert],function(err) {
    if (err) {
        console.log(err);
    }
});

// register the cookie scheme.
server.state('token', {
    ttl: 24 * 60 * 60 * 1000,
    isSecure: false,
    isHttpOnly: true,
    encoding: 'base64json',
    clearInvalid: false, // remove invalid cookies
    strictHeader: true // don't allow violations of RFC 6265
});


server.route(routes);



//Setup view engines
server.views({
    engines:{
        html:require('handlebars')
    },
    relativeTo: __dirname,
    path: './views'
});

//start the server
server.start(function() {
    console.log('Listening on ' + server.info.uri);
});
