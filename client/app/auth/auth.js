/**
 * Home Harmony Auth
 * Contains factories to be used for user authentication
 */
angular.module('homeHarmony.auth',[])

// Factory for basic authentication purposes
.factory("Auth", ["$firebaseAuth",
  // Returns reference to the Firebase
  function($firebaseAuth) {
    var ref = new Firebase(DB.url);
    return $firebaseAuth(ref);
  }
])

// Factory with more detailed authentication functions
.factory('UserAuth', ['$state', 'Auth',
  function ($state, Auth) {
    return {
      newUser: function (userEmail,userPassword, cb) {
        // Adds user information to the database
        Auth.$createUser({
          email    : userEmail,
          password : userPassword
        }).then(function(userData) {
          // Uses the new credentials to authenticate user
          return Auth.$authWithPassword({
            email    : userEmail,
            password : userPassword
          });
        }).then(function(authData) {
          cb(userEmail); // callback function
        }).catch(function(error) {
          console.error("Error:",error);
        });
      },
      login: function (userEmail,attemptedPassword, cb) {
        // Uses params to authenticate user
        Auth.$authWithPassword({
          email    : userEmail,
          password : attemptedPassword
        }).then(function(authData) {
          cb(authData.password.email); // callback function
        }).catch(function(error) {
          console.error("Error:",error);
          alert("This email and password combination doesn't match our records. Try again or click on Signup to make a new account.");
        });
      },
      logout: function () {
        Auth.$unauth();
        // Clears local storage
        localStorage.clear();

        //below kept in case defaults prove useful later instead of .clear():
        // localStorage.setItem('currentUserId', 'DEFAULT_USER_ID');
        // localStorage.setItem('currentHouseId', 'DEFAULT_HOUSE_ID');
        // localStorage.setItem('currentUserName', 'DEFAULT_USER_NAME');
        // localStorage.setItem('currentUserEmail', 'DEFAULT_USER_EMAIL');
        // Redirects to landing page
        $state.go('landing');
      }
    };
  }
]);
