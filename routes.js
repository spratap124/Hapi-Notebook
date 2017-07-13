var handlers   = require('./handlers');


module.exports =[
    {
        path:'/',
        method:'GET',
        handler:function(request, reply) {
            reply.view('index').unstate('token');
        }
    },
    {
        path:'/login',
        method:'GET',
        handler:function(request, reply) {
            reply.view('login');
        }
    },
    {
        path:'/login',
        method:'POST',
        handler:handlers.loginHandler,
        config: {
            state: {
                parse: true, // parse and store in request.state
                failAction: 'error' // may also be 'ignore' or 'log'
            }
        }
    },
    {
        path:'/register',
        method:'GET',
        handler:function(request, reply) {
            reply.view('register');
        }
    },
    {
        path:'/register',
        method:'POST',
        handler:handlers.registerHandler
    },
    {
        path:'/myNotes',
        method:'GET',
        handler:handlers.getMyNotes,
        config: {
            state: {
                parse: true, // parse and store in request.state
                failAction: 'error' // may also be 'ignore' or 'log'
            }
        }
    },
    {
        path:'/notes/new',
        method:'GET',
        handler:handlers.newNotePage
    },
    {
        path:'/notes/new',
        method:'POST',
        handler:handlers.createNewNote
    },
    {
        path:'/preview/{noteId}',
        method:'GET',
        handler:handlers.notePreview
    },
    {
        path:'/edit/{noteId}',
        method:'GET',
        handler:handlers.editGET
    },
    {
        path:'/edit/{noteId}',
        method:'POST',
        handler:handlers.updateNote
    },
    {
        path:'/myTrash',
        method:'GET',
        handler:handlers.myTrash
    },
    {
        path:'/delete/{noteId}',
        method:'GET',
        handler:handlers.deleteNote
    },
    {
        path:'/logout',
        method:'GET',
        handler:handlers.logoutHandler
    },
    {
        path:'/assets/css/{file*}',
        method:'GET',
        handler:{
            directory:{
                path:'./public/css',
                listing:false
            }
        }
    },
    {
        path:'/assets/img/{file*}',
        method:'GET',
        handler:{
            directory:{
                path:'./public/img',
                listing:false
            }
        }
    },
    {
        path:'/assets/js/{file*}',
        method:'GET',
        handler:{
            directory:{
                path:'./public/js',
                listing:false
            }
        }
    },
    {
        method: '*',
        path: '/{p*}', // catch-all path
        handler: function (request, reply) {
            reply.view('404').code(404);
        }
    }
];
