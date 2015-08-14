angular.module('homeHarmony.default', ['firebase'])

.controller('defaultCtrl', function($scope, $firebaseObject, $q, DrawPie){
  var db = new Firebase("https://dazzling-inferno-3592.firebaseio.com");
  currentHouseId = localStorage.getItem('currentHouseId');
  currentUserId = localStorage.getItem("currentUserId");
  $scope.currentUserName = localStorage.getItem("currentUserName").charAt(0).toUpperCase() + 
    localStorage.getItem("currentUserName").slice(1);
  $scope.currentDate = new Date();
  var expensesDb;
  var expensesArr;
  var dataObj;
  var issuesDb;
  var issuesArr;
  var usersDb
  var usersArr;


  db.once("value", function(snapshot) {
    expensesArr = [];
    issuesArr = [];
    usersArr = [];
    expensesDb = snapshot.val().houses[currentHouseId].expenses;
    issuesDb = snapshot.val().houses[currentHouseId].issues;
    usersDb = snapshot.val().houses[currentHouseId].houseMembers;
    for (expense in expensesDb){
      dataObj = {};
      dataObj.name = expensesDb[expense].expenseName;
      dataObj.y = expensesDb[expense].cost;
      expensesArr.push(dataObj);
    }
    $q.all(expensesArr).then(function(){
      $scope.expensesArr = expensesArr;
      DrawPie.drawPie($scope, "", false);
    });

    for (issue in issuesDb){
      issuesArr.push(issuesDb[issue]);
    }
    $q.all(issuesArr).then(function(){
      $scope.issuesArr = issuesArr;
      console.log($scope.issuesArr);
    });

    for (user in usersDb){
      usersArr.push(usersDb[user]);
    }
    $q.all(issuesArr).then(function(){
      $scope.usersArr = usersArr;
      localStorage.setItem("currentUsersArr", JSON.stringify(usersArr));

    });
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
});
