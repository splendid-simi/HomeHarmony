angular.module('homeHarmony.newHouse', ['firebase'])

.controller('newHouseCtrl', function ($scope, $location, $firebaseObject, DButil, $state) {
  var db = new Firebase("https://dazzling-inferno-3592.firebaseio.com");
  
  currentUserId = localStorage.getItem("currentUserId");
  $scope.joinHouse = function() {
    $('#joinHouseID').val('');
    localStorage.setItem("currentHouseId", $scope.chosenHouse);
    db.child('users').child(currentUserId).update({
      'house': $scope.chosenHouse
    });

    db.once("value", function(snapshot) {
      totalDb = snapshot.val();
      housesDb = totalDb.houses;
      for (var prop in housesDb) {
        if (prop === $scope.chosenHouse) {
          if (!housesDb[prop].houseMembers) {
            var members = {};
            members[currentUserId] = localStorage.getItem("currentUserEmail");;
            db.child('houses').child(prop).update({
              houseMembers: members
            });
          } else {
            var memberList = housesDb[prop].houseMembers;
            memberList[currentUserId] = localStorage.getItem("currentUserEmail");
            db.child('houses').child(prop).child('houseMembers').set(memberList);
          }
          console.log("REDIRECTING!!!");
          $state.go('dash.default');
        }
      }
    },
    function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  };

  $scope.newHouseReg = function() {
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

    db.child('houses').once('child_added', function(snapshot) {
      currentHouseId = snapshot.key();
      localStorage.setItem("currentHouseId", currentHouseId);

    //email users

      console.log(currentUserId, ' user, house ', currentHouseId)
      var userRef = db.child('users').child(currentUserId);
      userRef.update({
        'house': currentHouseId
      });
      console.log(currentHouseId, 'currentHouse')
      $state.go('dash.default');
    })

  };

  $scope.addRoommate = function() {
    $('#newEmail3').val('');
    DButil.getUserIdFromEmail($scope.roommateEmail, function(userId) {
      db.once("value", function(snapshot) {
        var memberList = snapshot.val().houses[currentHouseId].houseMembers;
        memberList[userId] = $scope.roommateEmail;
        db.child('houses').child(currentHouseId).child('houseMembers').set(memberList);
        db.child('users').child(userId).update({
          house: currentHouseId
        })
      },
      function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    });
  };
  console.log($scope);
});
