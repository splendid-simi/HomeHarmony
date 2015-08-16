/**
 * Home Harmony Login
 * Controller for login page
 */
angular.module('homeHarmony.login',['firebase', 'ui.router'])

.controller('LoginCtrl', function ($scope, $location, UserAuth, $firebaseObject, $state, DButil) {
  // database reference
  var db = new Firebase("https://dazzling-inferno-3592.firebaseio.com");

  $scope.logInUser = function() {
    // clear input fields
    $('#loginEmailField').val('');
    $('#loginPasswordField').val('');
    UserAuth.login($scope.email, $scope.password, function (userEmail) {
      // Query database for user info
      db.once("value", function(snapshot) {
        var userDb = snapshot.val().users;
        for (var uid in userDb) {
          if (userDb[uid].email === userEmail) {
            // Save id from database into local storage
            currentUserId = uid;
            localStorage.setItem("currentUserEmail", userEmail);
            localStorage.setItem("currentUserName", userDb[uid].firstname);
            localStorage.setItem("currentUserId", currentUserId);
            if (userDb[uid].house) {
              // Save house info and redirect to dashboard if user has a house
              currentHouseId = userDb[uid].house;
              localStorage.setItem("currentHouseId", currentHouseId);
              $state.go('dash.default');
            } else {
              // redirect to newHouse if user doesnt have a house yet
              $state.go('newHouse');
            }
          }
        }
      },
      function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    });
  };
});
