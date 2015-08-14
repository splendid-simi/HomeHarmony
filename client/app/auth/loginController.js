angular.module('homeHarmony.login',['firebase'])

.controller('LoginCtrl', function ($scope, $location, UserAuth, $firebaseObject, $state) {

  var db = new Firebase("https://dazzling-inferno-3592.firebaseio.com");

  $scope.logInUser = function(){
    $('#loginEmailField').val('');
    $('#loginPasswordField').val('');
    UserAuth.login($scope.email, $scope.password, function (userEmail){

      //try to factor this out as a separate named function "later"

      db.once("value", function(snapshot) {
        totalDb = snapshot.val();
        userDb = totalDb.users;
        console.log(userDb)
        console.log('uemail', userEmail)
        for (var prop in userDb){
          if (userDb[prop].email === userEmail) {
            currentUserId = prop;
            localStorage.setItem("currentUserEmail", userEmail);
            localStorage.setItem("currentUserName", userDb[prop].firstname);
            localStorage.setItem("currentUserId", currentUserId);
            if (userDb[prop].house) {
              currentHouseId = userDb[prop].house;
              localStorage.setItem("currentHouseId", currentHouseId);
            } else {
              $state.go('dash.newHouse')
            }
            console.log('CHID ', currentHouseId);
          }
        }
        console.log(currentUserId, 'CUID')

      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });

    });
  };
});
