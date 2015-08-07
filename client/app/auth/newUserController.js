angular.module('homeHarmony.newUser', ['firebase'])

.controller('NewUserCtrl', function ($scope, $location, $firebaseObject, UserAuth) {

  var db = new Firebase("https://dazzling-inferno-3592.firebaseio.com");

  $scope.addUser = function(){
    var userObj = {
      firstname: $scope.firstname,
      lastname: $scope.lastname,
      email: $scope.email  //unique
      // dateJoined: new Date()
      // house: houseId
    };
    db.child('users').push(userObj);
    UserAuth.newUser($scope.email, $scope.password);
  };
  console.log($scope)
});
