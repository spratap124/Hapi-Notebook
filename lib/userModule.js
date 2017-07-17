var bcrypt  = require('bcrypt');
var fs      = require('fs');
var users = loadUsers();
var uuid  = require('uuid');
var jwt    = require('jsonwebtoken');
var connection = require('../database/dbConnection');

process.env.SECRET_KEY = 'hafha2F3RT3ET2FYGFKJhishgjueiuF5n5095202nfhas983rhb';

module.exports = {
    // user creation
    createUser:function(request, reply) {
        var name = request.payload.name;
        var email =  request.payload.email;
        var password = request.payload.password;

        //connect to database
        var sql = "select * from users where email=?";
        connection.query(sql,email,function(err,result) {
            if (err) {
                throw err;
            }else{
                //check if user already exists
                if(result.length > 0){
                    //console.log(result);
                    var errMsg = 'User already exists, Try to login!';
                    reply.view('login',{errMsg:errMsg});
                }
                // if not then create the user
                else {
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
                            //insert into dataabse
                            connection.query("INSERT INTO users SET ?",newUser, function (err, result) {
                                if (err){
                                    throw err;
                                }else{
                                    // console.log("1 record inserted");
                                    var successMsg = 'User created successfully, now login!'
                                    reply.view('login',{successMsg:successMsg});
                                }
                            });
                        });
                    });
                }
            }
        });
    },
    // validate a user login
    validateUser:function(request, reply) {
        var email = request.payload.email;
        var userPassword = request.payload.password;

        //connect to database
        var sql = "select * from users where email=? and password=?";
        connection.query(sql,[email,userPassword], function (err, result) {
            if (err) throw err;

            console.log(result);

        });


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
