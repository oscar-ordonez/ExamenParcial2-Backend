var user = require('../schemas/user');
var SHA3 = require("crypto-js/sha3");
var boom = require('boom');

exports.createUser = {
  auth: {
    mode:'try',
    strategy:'session'
  },
  handler: function(request, reply) {
    console.log(request.payload);
    var newUser = new user({
      foto: request.payload.foto,
      username : request.payload.username,
      password : SHA3(request.payload.password),
      email : request.payload.email,
      name : request.payload.name,
      phone : request.payload.phone,
      scope : request.payload.scope
    });
    newUser.save(function (err) {
      console.log(err);
      if(err){
        return reply(boom.notAcceptable('Username must be unique: ' + err));
      }else{
        return reply('ok');
      };
    });
  }
};

exports.getUsers = {
  handler: function(request, reply){
    var users = user.find({});
    reply(users);
  }
}

exports.updateUser = {
  auth: {
    mode:'required',
    strategy:'session',
    scope: ['adminUser', 'superUser', 'regularUser']
  },
  handler: function(request, reply){
    user.update({username : request.params.username},
      { foto: request.payload.foto,
        username : request.payload.username,
        password: SHA3(request.payload.password),
        email: request.payload.email,
        name: request.payload.name,
        phone: request.payload.phone}).exec();
    reply("ok");
  }
}

exports.deleteUser = {
  auth: {
    mode:'required',
    strategy:'session',
    scope: ['adminUser', 'regularUser', 'superUser']
  },
  handler: function(request, reply){
    user.find({username: request.params.username}).remove().exec();
    reply("ok");
  }
}


exports.getUser = {
  handler: function(request, reply){
    var users = user.find({username:request.params.username});
    reply(users);
  }
}
