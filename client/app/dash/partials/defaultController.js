/**
 * Home Harmony Default
 * Controller for dashboard
 */
angular.module('homeHarmony.default', ['firebase'])

.controller('defaultCtrl', function($scope, $firebaseObject, $q, DrawPie) {
  // database reference
  var db = new Firebase("https://dazzling-inferno-3592.firebaseio.com");
  // updates global variables
  currentHouseId = localStorage.getItem('currentHouseId');
  currentUserId = localStorage.getItem("currentUserId");
  // Capitalizes users first name which is displayed on dash
  $scope.currentUserName = localStorage.getItem("currentUserName").charAt(0).toUpperCase() + 
    localStorage.getItem("currentUserName").slice(1);

  
  $scope.currentDate = new Date();

  // Initialize variables
  var expensesDb, expensesArr, dataObj, issuesDb, issuesArr;
  var usersDb, usersArr, tasksDb, tasksArr, tasksNotCompletedCount;

  // query database
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
    // Execute only after expensesArr is ready
    $q.all(expensesArr).then(function() {
      // Place on scope to be displayed
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
    // Execute only after issuesArr is ready
    $q.all(issuesArr).then(function() {
      // Place on scope to be displayed
      $scope.issuesArr = issuesArr;
    });

    for (var user in usersDb) {
      usersArr.push(usersDb[user]);
    }
    // Execute only after userssArr is ready
    $q.all(usersArr).then(function() {
      // Place on scope to be displayed
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
    // Execute only after tasksArr is ready
    $q.all(tasksArr).then(function() {
      // Place on scope to be displayed
      $scope.tasksArr = tasksArr;
      $scope.tasksNotCompletedCount = tasksNotCompletedCount;
    });
  },
  function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
});
