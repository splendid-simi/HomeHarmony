angular.module('homeHarmony.login',['firebase'])

.controller('LoginCtrl', function ($scope, $location, UserAuth, $firebaseObject) {

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
            currentHouseId = userDb[prop].house;
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
