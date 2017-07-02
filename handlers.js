'use strict';
var fs          = require('fs');
var userModule  = require('./lib/userModule.js');
var jwt         = require('jsonwebtoken');
var uuid        = require('uuid');
var SECRET_KEY  = process.env.SECRET_KEY;
var notes       = loadNotes();

// handlers

function getMyNotes (request, reply) {
  //get token from cookies
  var token = request.state.token;
  //verify the token and get the userId
  jwt.verify(token,SECRET_KEY,function(err, data) {
    if(err){
      reply("you are not authoised to view this page").code(401);
    }else {
      var userId =  data;
      var myAllNotes= notes[userId];       // get all the notes both deleted and undeleted
      var myUndeletedNotes ={};
      for(var note in myAllNotes){
        if (!myAllNotes[note].isDelete) {
            myUndeletedNotes[note] = myAllNotes[note];
        }
      }
      reply.view('myNotes',{myNotes:myUndeletedNotes});
    }
  });
}

function myTrash (request, reply) {
  //get token from cookies
  var token = request.state.token;
  //verify the token and get the userId
  jwt.verify(token,SECRET_KEY,function(err, data) {
    if(err){
      reply("you are not authoised to view this page").code(401);
    }else {
      var userId =  data;
      var myAllNotes= notes[userId];       // get all the notes both deleted and undeleted
      var myDeletedNotes ={};
      for(var note in myAllNotes){
        if (myAllNotes[note].isDelete) {
            myDeletedNotes[note] = myAllNotes[note];
        }
      }
      reply(myDeletedNotes);
    }
  });
}


function newNotePage (request, reply) {
  //get token from cookies
  var token = request.state.token;
  //verify the token and get the userId
  jwt.verify(token,SECRET_KEY,function(err, data) {
    if(err){
      reply("you are not authoised to view this page").code(401);
    }else {
      reply.view('new');
    }
  });

}

function createNewNote (request, reply) {

  // make a note
  var newNote     = {
    noteHeading:request.payload.noteHeading,
    noteValue  :request.payload.noteValue,
    isDelete   :false
  };

  //get token from cookies
  var token = request.state.token;
  //verify the token and get the userId
  jwt.verify(token,SECRET_KEY,function(err, data) {
    if(err){
      reply("you are not authoised to view this page").code(401);
    }else {
      var userId = data;
      var noteId = uuid.v1();

      // check if a note is already existing for this user
      if(notes[userId]){
        notes[userId][noteId]=newNote;
        // save into database
        fs.writeFileSync('./database/notes.json',JSON.stringify(notes));
      }
      else {
        notes[userId] = {};     // create a key of object type
        notes[userId][noteId]=newNote;
        // save into database
        fs.writeFileSync('./database/notes.json',JSON.stringify(notes));
      }
      reply.redirect('/myNotes');
    }
  });
}

function notePreview (request, reply) {
  //get the noteId from request
  var noteId = request.params.noteId;
//console.log("noteid is :======="+noteId);
  //get token from cookies
  var token = request.state.token;
  var notePreview ={};

    jwt.verify(token,SECRET_KEY,function(err,data) {
      if(err){
        reply("you are not authoised to view this page").code(401);
      }else {
        var userId = data;

        //get all the notes for this user
          var allNotes = notes[userId];
          //console.log("all notes==="+allNotes);
          //console.log(allNotes);
        for(var note in allNotes) {
            //  console.log(note);
              if(note==noteId){
                notePreview = allNotes[note];
              }
          };
      }
      console.log("notePreview is :==="+notePreview);
      reply(notePreview).code(200);
    });
}

function deleteNote (request,reply) {
  //get the noteId from request
  var noteId = request.params.noteId;
  var delType = request.query.type;
  console.log(delType);

  //get token from cookies
  var token = request.state.token;

    jwt.verify(token,SECRET_KEY,function(err,data) {
      if(err){
        reply("you are not authoised to view this page").code(401);
      }else {
        var userId = data;

        //get all the notes for this user
          var userNotes = notes[userId];
          for(var note in userNotes) {
              //  console.log(note);
                if(note==noteId){
                    if(delType=='softdel'){
                      userNotes[note].isDelete = true;
                    }else if (delType=='undel') {
                      userNotes[note].isDelete = false;
                    }else if(delType=='harddel') {
                      delete userNotes[note];
                    }
                }
            };
          notes[userId] = userNotes;
          fs.writeFileSync('./database/notes.json',JSON.stringify(notes));
          reply.redirect('/myNotes');
      }
    });
}

function logoutHandler (request, reply) {
reply.redirect('/login').unstate('token');
}

// load notes from database
function loadNotes() {
  var data = fs.readFileSync('./database/notes.json','utf8');
  return JSON.parse(data.toString());
}


module.exports ={
  registerHandler :userModule.createUser,         //path:'/register'
  loginHandler    :userModule.validateUser,       //path:'/login'
  getMyNotes      :getMyNotes,                    //path:'/myNotes'
  newNotePage     :newNotePage,                   //path:'/notes/new' method:'GET'
  createNewNote   :createNewNote,                 //path:'/notes/new' method:'POST'
  logoutHandler   :logoutHandler ,                //path:'/logout'
  notePreview     :notePreview,                   //preview/{noteId}
  deleteNote      :deleteNote,
  myTrash         :myTrash
};
