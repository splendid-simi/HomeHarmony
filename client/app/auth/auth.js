angular.module('homeHarmony.auth',[])
.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://dazzling-inferno-3592.firebaseio.com");
    return $firebaseAuth(ref);
  }
])
.factory('UserAuth',['$state','Auth',
  function ($state, Auth){
    return {
      newUser: function (userEmail,userPassword){
        Auth.$createUser({
          email    : userEmail,
          password : userPassword
        }).then(function(userData){
          return Auth.$authWithPassword({
            email    : userEmail,
            password : userPassword
          });
        }).then(function(authData){
          $state.go('dash');
        }).catch(function(error){
          console.error("Error:",error);
        });
      },
      login: function (userEmail,attemptedPassword, cb){
        Auth.$authWithPassword({
          email    : userEmail,
          password : attemptedPassword
        }).then(function(authData){
          $state.go('dash');
          cb(authData.password.email);
        }).catch(function(error){
          console.error("Error:",error);
        });
      },
      logout: function (){
        Auth.$unauth();
        //redirect
        $state.go('landing');
      }
    };
  }
]);



