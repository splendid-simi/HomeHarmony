angular.module('homeHarmony')
.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://dazzling-inferno-3592.firebaseio.com");
    return $firebaseAuth(ref);
  }
])
.factory('UserAuth',['Auth',
  function (Auth){
    auth = Auth;
    return {
      newUser: function (userEmail,userPassword){
        auth.createUser({
          email    : userEmail,
          password : userPassword
        }, function (error, userData){
          if (error) { retern console.error(error); }
          console.log("Welcome to HomeHarmony user #"+userData.uid);
          //redirect
          $state.go('login');
        })
      },
      login: function (userEmail,attemptedPassword){
        auth.authWithPassword({
          email    : userEmail,
          password : attemptedPassword
        }, function (error, authData){
          if (error){return console.error(error);}
          console.log("Authenticated successfully with payload:", authData);
          //redirect
          $state.go('/'); // different state?
        });
      },
      logout: function (){
        auth.unauth();
        //redirect
        $state.go('login');
      }
    };
  }
]);



