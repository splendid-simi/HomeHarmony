angular.module('homeHarmony.default', ['firebase'])

.controller('defaultCtrl', function($scope, $firebaseObject, $q, DrawPie){
  var db = new Firebase("https://dazzling-inferno-3592.firebaseio.com");
  currentHouseId = localStorage.getItem('currentHouseId');
  currentUserId = localStorage.getItem("currentUserId");
  $scope.currentDate = new Date();
  var expensesDb;
  var expensesArr;
  var dataObj;
  var issuesDb;
  var issuesArr;


  db.once("value", function(snapshot) {
    expensesArr = [];
    issuesArr = [];
    expensesDb = snapshot.val().houses[currentHouseId].expenses;
    issuesDb = snapshot.val().houses[currentHouseId].issues;
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
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
});
