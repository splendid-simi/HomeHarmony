/**
 * Home Harmony Expenses
 * Controller for expenses page
 */
angular.module('homeHarmony.expenses', ['firebase'])

.controller('expensesCtrl', function($scope, $firebaseObject, $q, DrawPie, DButil) { 
  // database reference
  var db = new Firebase("https://dazzling-inferno-3592.firebaseio.com");
  var expensesDb;
  var expensesArr;
  var userExpensesArr;
  var dataObj;
  var uDataObj;
  currentHouseId = localStorage.getItem('currentHouseId');
  currentUserId = localStorage.getItem("currentUserId");
  $scope.currentDate = new Date();

  $scope.showExpenses = function() {
    // query database
    db.once("value", function(snapshot) {
      expensesArr = [];
      userExpensesArr = [];
      expensesDb = snapshot.val().houses[currentHouseId].expenses;
      userExpensesDb = snapshot.val().users[currentUserId].userExpenses;
      // create an array of expense data to be displayed in expense view
      for (var expense in expensesDb) {
        dataObj = {};
        dataObj.name = expensesDb[expense].expenseName;
        dataObj.y = expensesDb[expense].cost;
        expensesArr.push(dataObj);
      }
      // Execute when expensesArr is ready
      $q.all(expensesArr).then(function() {
        // Add to scope to be displayed
        $scope.expensesArr = expensesArr;
        // draw pie graph
        DrawPie.drawPie($scope, "Expense Analysis", true);
      });
      // create an array of user specific expenses
      for (var uExpense in userExpensesDb) {
        uDataObj = {};
        uDataObj.name = userExpensesDb[uExpense].name;
        uDataObj.y = userExpensesDb[uExpense].splitCost;
        uDataObj.paid = userExpensesDb[uExpense].paid;
        userExpensesArr.push(uDataObj);
      }
      // Execute when userExpensesArr is ready
      $q.all(userExpensesArr).then(function() {
        // Add to scope to be displayed
        $scope.userExpensesArr = userExpensesArr;
      });
    },
    function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  };

  // Redraw page whenever a new expense is created
  db.child('houses').child(currentHouseId).child('expenses').on('child_added', function() {
    $scope.showExpenses();
  });

  $scope.newExpense = function() {
    var date = $scope.expenseDate;
    $('#expenseName').val('');
    $('#expenseCost').val('');
    $('#expenseDate').val('');
    // Create expense object to be added to database
    var expenseObj = {
      expenseName: $scope.expenseName,
      dueDate: (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear(),
      cost: $scope.expenseCost,
      paid: false
    };
    // push to database
    db.child('houses').child(currentHouseId).child('expenses').push(expenseObj);
    // Split expense and add to each user in database
    $scope.splitExpense(expenseObj);
  };

  $scope.splitExpense = function(expense) {
    // query database
    db.once("value", function(snapshot) {
      var houseMembers = snapshot.val().houses[currentHouseId].houseMembers;
      $scope.houseSize = Object.keys(houseMembers).length;
      // for each member of the house
      for (var memberId in houseMembers) {
        DButil.getUserIdFromEmail(houseMembers[memberId], function(userId) {
          // Add their share of the expense
          db.child('users').child(userId).child('userExpenses').push({
            name: expense.expenseName,
            splitCost: expense.cost/$scope.houseSize,
            paid: false
          });
        });
      }
    });
  };

  $scope.payExpense = function(expenseName) {
    db.on('value', function(snapshot) {
      uExpenseDb = snapshot.val().users[currentUserId].userExpenses;
      for (var expense in uExpenseDb) {
        if (uExpenseDb[expense].name === expenseName) {
          // set paid property to true for chosen expense
          db.child('users').child(currentUserId).child('userExpenses').child(expense).update({
            paid: true
          });
        }
      }
    });
  };
  $scope.showExpenses();
})
.factory('DrawPie', function() {
  return {
    // showLabels true means each section has an arrow and description,
    // false means the key is under the graph
    drawPie : function($scope, title, showLabels) {
      $('#expGraph').highcharts( {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: title
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: showLabels,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
            }
          },
          showInLegend: !showLabels
        }
      },
      series: [{
        name: "Expenses",
        colorByPoint: true,
        data: $scope.expensesArr
      }]
    });
    }
  };
});
