angular.module('homeHarmony.default', ['firebase'])

.controller('defaultCtrl', function($scope, $firebaseObject, $q, DrawPie){
  var db = new Firebase("https://dazzling-inferno-3592.firebaseio.com");
  currentHouseId = localStorage.getItem('currentHouseId');
  currentUserId = localStorage.getItem("currentUserId");
  $scope.currentDate = new Date();
  var expensesDb;
  var expensesArr;
  var dataObj;


  db.once("value", function(snapshot) {
    expensesArr = [];
    expensesDb = snapshot.val().houses[currentHouseId].expenses;
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
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
});
