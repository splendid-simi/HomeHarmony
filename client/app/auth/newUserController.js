angular.module('homeHarmony.newUser', ['firebase'])

.controller('NewUserCtrl', function ($scope, $location, $firebaseObject, UserAuth, $state) {
  var db = new Firebase("https://dazzling-inferno-3592.firebaseio.com");

  $scope.addUser = function() {
    $('#newPasswordField').val('');
    $('#newFirstNameField').val('');
    $('#newLastNameField').val('');
    $('#newHouseID').val('');
    var userObj = {
      firstname: $scope.firstname,
      lastname: $scope.lastname,
      email: $scope.email  //unique
      // dateJoined: new Date()
      // house: houseId
    };
    
    UserAuth.newUser(userObj.email, $scope.password, function(userEmail) {
      db.child('users').once('value', function(snapshot) {
        var userDb = snapshot.val();
        for (var prop in userDb) {
          if(userDb[prop].email === userEmail) {
            currentUserId = prop;
            localStorage.setItem("currentUserEmail", userEmail);
            localStorage.setItem("currentUserName", userDb[prop].firstname);
            localStorage.setItem("currentUserId", currentUserId);
          }
        }
        console.log(currentUserId, 'userid newusercont');
      });
      currentUser = userEmail;
      console.log(userEmail);
      console.log(userObj);
      db.child('users').push(userObj);
    });
    $state.go('dash.newHouse');
  };
  console.log($scope)
});
