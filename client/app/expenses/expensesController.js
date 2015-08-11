angular.module('homeHarmony.expenses', ['firebase'])

.controller('expensesCtrl', function($scope, $firebaseObject){
console.log("In expensesCtrl");
  var db = new Firebase("https://dazzling-inferno-3592.firebaseio.com");
  $scope.expensesArr = [];
  var expensesDb = {};
  currentHouseId = "-JwPcwYMViRlKqSZmnOw";

  // Attach an asynchronous callback to read the data at our posts reference
  db.on("value", function(snapshot) {
    console.log(snapshot.val());
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

/*
  {
    "userId": "e@e.com",
    "expenseID" : "123",
    "expenseName": "Cable",
    "cost": 125,
    "dueDate": "8/31/15",
    "repeat": -1,
    "external": false
  }
 */
/*
  $scope.getExpenses = function() {
    db.on('value', function(snapshot) {
      expensesDb = snapshot.houses.currentHouseId.expenses;
      for (var i = 0; i < expensesDb.length; i++) {
        $scope.expensesArr.push(expensesDb[i]);
        console.log('retrieved expenses ', $scope.expensesArr)
      }
      // $scope.tasks = taskArr;
    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    })
  };

  $scope.getExpenses();
  */
})
