angular.module('homeHarmony.default', ['firebase'])

.controller('defaultCtrl', function($scope, $firebaseObject, $q, DrawPie) {
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
  var usersDb;
  var usersArr;
  var tasksDb;
  var tasksArr;
  var tasksNotCompletedCount;

  db.once("value", function(snapshot) {
    tasksNotCompletedCount = 0;
    expensesArr = [];
    issuesArr = [];
    usersArr = [];
    tasksArr = [];
    // Retrieve data from the database for the current house
    expensesDb = snapshot.val().houses[currentHouseId].expenses;
    issuesDb = snapshot.val().houses[currentHouseId].issues;
    usersDb = snapshot.val().houses[currentHouseId].houseMembers;
    tasksDb = snapshot.val().houses[currentHouseId].tasks;

    // Build expensesArr so we can graph the expenses
    for (var expense in expensesDb) {
      dataObj = {};
      dataObj.name = expensesDb[expense].expenseName;
      dataObj.y = expensesDb[expense].cost;
      expensesArr.push(dataObj);
    }
    $q.all(expensesArr).then(function() {
      $scope.expensesArr = expensesArr;
      // If we have expenses, show the pie chart on dash.expenses subview
      if (expensesArr.length > 0) {
        // "" no title, false: show legend under the graph
        // DrawPie factory is in expensesController
        DrawPie.drawPie($scope, "", false);
      }
    });

    for (var issue in issuesDb) {
      issuesArr.push(issuesDb[issue]);
    }
    $q.all(issuesArr).then(function() {
      $scope.issuesArr = issuesArr;
      console.log($scope.issuesArr);
    });

    for (var user in usersDb) {
      usersArr.push(usersDb[user]);
    }
    $q.all(usersArr).then(function() {
      $scope.usersArr = usersArr;
      localStorage.setItem("currentUsersArr", JSON.stringify(usersArr));
    });
    // See how many tasks are not yet completed
    for (var task in tasksDb) {
      if (!tasksDb[task].completed) {
        tasksArr.push(tasksDb[task]);
        tasksNotCompletedCount++;
      }
    }
    console.log("tasksArr", tasksArr);
    $q.all(usersArr).then(function() {
      $scope.tasksArr = tasksArr;
      $scope.tasksNotCompletedCount = tasksNotCompletedCount;
    });
  },
  function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
});
