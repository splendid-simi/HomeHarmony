angular.module('homeHarmony.newHouse',['firebase'])

.controller('newHouseCtrl', function ($scope, $location, $firebaseObject) {

  var db = new Firebase("https://dazzling-inferno-3592.firebaseio.com");

  $scope.joinHouse = function(){
    $('#joinHouseID').val('');
  }

  $scope.newHouseReg = function(){
    $('#newEmail1').val('');
    $('#newEmail2').val('');
    var houseMembers = [
      currentUser,
      $scope.email1,
      $scope.email2
    ];
    var houseObj = {
      houseMembers: houseMembers,

      // tasks: [{}],
      // issues: [{}],          these to be added elsewhere
      // expenses: [{}]

    }
    db.child('houses').push(houseObj);

    db.child('houses').once('child_added', function(snapshot){
      currentHouseId = snapshot.key();
    //email users

      console.log(currentUserId, ' user, house ', currentHouseId)
      var userRef = db.child('users').child(currentUserId);
      userRef.update({
        'house': currentHouseId
      });
      console.log(currentHouseId, 'currentHouse')
    })

  }
  console.log($scope);
});
