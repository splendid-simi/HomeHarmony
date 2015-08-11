angular.module('homeHarmony.newUser', ['firebase'])

.controller('NewUserCtrl', function ($scope, $location, $firebaseObject, UserAuth) {

  var db = new Firebase("https://dazzling-inferno-3592.firebaseio.com");

  $scope.addUser = function(){
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
    UserAuth.newUser(userObj.email, $scope.password, function(userEmail){
      db.child('users').once('value', function(snapshot){
        var temp = snapshot.val();
        for (var prop in temp){
          if(temp[prop].email === userEmail) {
            currentUserId = prop;
          }
        }
        console.log(currentUserId, 'userid newusercont');
      });
      currentUser = userEmail;
      console.log(userEmail);
      console.log(userObj);
      db.child('users').push(userObj);
    });
  };
  console.log($scope)
});
