angular.module('homeHarmony.newHouse',['firebase'])

.controller('newHouseCtrl', function ($scope, $location, $firebaseObject) {

  currentUserId = localStorage.getItem("currentUserId");

  var db = new Firebase("https://dazzling-inferno-3592.firebaseio.com");
  
    $scope.joinHouse = function(){
    $('#joinHouseID').val('');
    db.child('users').child(currentUserId).update({
      'house': $scope.chosenHouse
    });
    db.once("value", function(snapshot) {
        totalDb = snapshot.val();
        housesDb = totalDb.houses;
        console.log("houses!",housesDb)
        for (var prop in housesDb){
          console.log(prop);
          if (prop === $scope.chosenHouse) {
            console.log('join successful');
            var memberList = housesDb[prop].houseMembers;
            memberList[currentUserId] = localStorage.getItem("currentUserEmail");
            // newMember[currentUserId] = localStorage.getItem("currentUserEmail");
            db.child('houses').child(prop).child('houseMembers').set(memberList);
          }
        }
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
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
      localStorage.setItem("currentHouseId", currentHouseId);

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
