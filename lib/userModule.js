var bcrypt  = require('bcrypt'),
fs      = require('fs'),
users = loadUsers(),
uuid  = require('uuid'),
jwt    = require('jsonwebtoken');


process.env.SECRET_KEY = 'hafha2F3RT3ET2FYGFKJhishgjueiuF5n5095202nfhas983rhb';

module.exports = {
    // user creation
    createUser:function(request, reply) {
        var name = request.payload.name;
        var email =  request.payload.email;
        var password = request.payload.password;

        //check if user already exists
        if(users[email]){
            var errMsg = 'User already exists, Try to login!';
            reply.view('login',{errMsg:errMsg});

        }else{
            // encrypt the password
            bcrypt.genSalt(10,function(err, salt) {
                bcrypt.hash(password, salt, function(err, hash) {
                    var id = uuid.v1();
                    var newUser ={
                        name: name,
                        email:email,
                        password:hash,
                        id:id
                    };
                    // create new user
                    users[email] = newUser;
                    //save new user into database
                    fs.writeFileSync('./database/users.json',JSON.stringify(users));
                    //show success message
                    var successMsg = 'User created successfully, now login!'
                    reply.view('login',{successMsg:successMsg});
                });
            });
        }
    },
    // validate a user login
    validateUser:function(request, reply) {
        var email = request.payload.email;
        var userPassword = request.payload.password;

        // get user form database
        var user = users[email];

        // check if exists
        if(!user){
            var errMsg = 'User not found';
            reply.view('login',{errMsg:errMsg});
        }
        else {
            // validate the user
            bcrypt.compare(userPassword, user.password, function(err, isValid) {

                if(!isValid){
                    var errMsg = 'Wrong username or password!';
                    reply.view('login',{errMsg:errMsg});
                }
                else {
                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign(user.id, process.env.SECRET_KEY);
                    //  console.log("token generated:  "+token);
                    // save this tokent on client side
                    reply.redirect('/myNotes').state('token', token);
                }
            });
        }
    }
};

// get all the user in database
function loadUsers() {
    var data = fs.readFileSync('./database/users.json','utf8');
    return JSON.parse(data.toString());
}
