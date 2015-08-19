/**
 * Home Harmony New House
 * Controller for new house page
 */


angular.module('homeHarmony.newHouse', ['firebase'])

.controller('newHouseCtrl', function ($scope, $location, $firebaseObject, DButil, $state, UserAuth) {
  // database reference
  var db = new Firebase(DB.url);
  currentUserId = localStorage.getItem("currentUserId");
  $scope.currentHouseId = localStorage.getItem("currentHouseId");
  console.log($scope.currentHouseId);

  $scope.joinHouse = function() {
    $('#joinHouseID').val('');
    localStorage.setItem("currentHouseId", $scope.chosenHouse);
    // add house property to user in database
    db.child('users').child(currentUserId).update({
      'house': $scope.chosenHouse
    });

    // query database to find desired house
    db.once("value", function(snapshot) {
      var housesDb = snapshot.val().houses;
      for (var houseId in housesDb) {
        if (houseId === $scope.chosenHouse) {
          if (!housesDb[houseId].houseMembers) {
            // if there are no members, create a member list with current user
            var members = {};
            members[currentUserId] = localStorage.getItem("currentUserEmail");
            // push list to database
            db.child('houses').child(houseId).update({
              houseMembers: members
            });
          } else {
            // else add user to member list and push to database
            var memberList = housesDb[houseId].houseMembers;
            memberList[currentUserId] = localStorage.getItem("currentUserEmail");
            db.child('houses').child(houseId).child('houseMembers').set(memberList);
          }
        }
      // redirect to dashboard
      $state.go('dash.default');
      }
    },
    function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  };

  $scope.leaveHouse = function() {
    $('#leaveHouseID');
    localStorage.setItem("currentHouseId", null);
    db.child('users').child(currentUserId).update({
      'house': null
    });

    // // query database to find desired house
    // db.once("value", function(snapshot) {
    //   var housesDb = snapshot.val().houses;
    //   for (var houseId in housesDb) {
    //     if (houseId === $scope.chosenHouse) {
    //       if (!housesDb[houseId].houseMembers) {
    //         // if there are no members, create a member list with current user
    //         var members = {};
    //         members[currentUserId] = localStorage.getItem("currentUserEmail");
    //         // push list to database
    //         db.child('houses').child(houseId).update({
    //           houseMembers: members
    //         });
    //       } else {
    //         // else add user to member list and push to database
    //         var memberList = housesDb[houseId].houseMembers;
    //         memberList[currentUserId] = localStorage.getItem("currentUserEmail");
    //         db.child('houses').child(houseId).child('houseMembers').set(memberList);
    //       }
    //     }
    //   // redirect to dashboard
    //   $state.go('dash.default');
    //   }
    // },
    // function (errorObject) {
    //   console.log("The read failed: " + errorObject.code);
    // });
  };

  $scope.newHouseReg = function() {
    // $('#newEmail1').val('');
    // $('#newEmail2').val('');

    // create a list of house members
    var houseMembers = [
      currentUser
      // $scope.email1
    ];
    // add member list to new house object
    var houseObj = {
      houseMembers: houseMembers
    };
    // add house to database
    db.child('houses').push(houseObj);


    db.child('houses').once('child_added', function(snapshot) {
      currentHouseId = snapshot.key();
      localStorage.setItem("currentHouseId", currentHouseId);
      //email users
      console.log(currentUserId, ' user, house ', currentHouseId);
      var userRef = db.child('users').child(currentUserId);
      userRef.update({
        'house': currentHouseId
      });
      console.log(currentHouseId, 'currentHouse');
      $state.go('dash.default');
    });

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
        });
      },
      function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    });
  };

  $scope.logOut = function() {
    console.log('Logging out.');
    UserAuth.logout();
  };

  // function for ng-disable on create house button to disable creating a
  // new house if a user is aready part of a house that is not the default house
  $scope.uniqueHouseIdExists = function() {
    return localStorage.getItem("currentHouseId") !== null;
  };

  $scope.uniqueHouseIdDoesNotExist = function() {
    return localStorage.getItem("currentHouseId") === null;
  };

  console.log($scope);
});
