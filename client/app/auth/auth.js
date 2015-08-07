angular.module('homeHarmony')
.factory('Auth',[function(){
  var ref = new Firebase("https://dazzling-inferno-3592.firebaseio.com");
  return {
    newUser: function(userEmail,userPassword){
      ref.createUser({
        email    : userEmail,
        password : userPassword
      }, function(error, userData){
        if (error) { retern console.error(error); }
        console.log("Welcome to HomeHarmony user #"+userData.uid);
      })
    },
    login: function(userEmail,attemptedPassword){
      ref.authWithPassword({
        email    : userEmail,
        password : attemptedPassword
      }, function(error, authData) {
        if (error) { return console.error(error); }
        console.log("Authenticated successfully with payload:", authData);
    },
    logout: function(){
      ref.unauth();
    },
  };
}]);
