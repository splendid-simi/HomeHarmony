angular.module('homeHarmony.expenses', ['firebase'])

.controller('expensesCtrl', function($scope, $firebaseObject, $q, DrawPie, DButil){ 
  var db = new Firebase("https://dazzling-inferno-3592.firebaseio.com");
  currentHouseId = localStorage.getItem('currentHouseId');
  currentUserId = localStorage.getItem("currentUserId");
  $scope.currentDate = new Date();
  var expensesDb;
  var expensesArr;
  var userExpensesArr;
  var dataObj;
  var uDataObj;


  db.once("value", function(snapshot) {
    expensesArr = [];
    userExpensesArr = [];
    expensesDb = snapshot.val().houses[currentHouseId].expenses;
    userExpensesDb = snapshot.val().users[currentUserId].userExpenses;
    console.log(userExpensesDb);
    for (expense in expensesDb){
      dataObj = {};
      dataObj.name = expensesDb[expense].expenseName;
      dataObj.y = expensesDb[expense].cost;
      expensesArr.push(dataObj);
    }
    $q.all(expensesArr).then(function(){
      $scope.expensesArr = expensesArr;
      DrawPie.drawPie($scope, "Expense Analysis", true);
    });

    for (uExpense in userExpensesDb){
      uDataObj = {};
      uDataObj.name = userExpensesDb[uExpense].name;
      uDataObj.y = userExpensesDb[uExpense].splitCost;
      uDataObj.paid = userExpensesDb[uExpense].paid;
      userExpensesArr.push(uDataObj);
    }
    $q.all(userExpensesArr).then(function(){
      $scope.userExpensesArr = userExpensesArr;
    });
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

  $scope.newExpense = function(){
    var date = $scope.expenseDate;
    $('#expenseName').val('');
    $('#expenseCost').val('');
    $('#expenseDate').val('');
    var expenseObj = {
      expenseName: $scope.expenseName,
      dueDate: (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear(),
      cost: $scope.expenseCost,
      paid: false
    };
    db.child('houses').child(currentHouseId).child('expenses').push(expenseObj);
    $scope.splitExpense(expenseObj);

  };

  $scope.splitExpense = function(expense){
    db.once("value", function(snapshot) {
      var houseMembers = snapshot.val().houses[currentHouseId].houseMembers;
      $scope.houseSize = Object.keys(houseMembers).length;
      for (memberId in houseMembers){
        DButil.getUserIdFromEmail(houseMembers[memberId], function(userId){
          db.child('users').child(userId).child('userExpenses').push({
            name: expense.expenseName,
            splitCost: expense.cost/$scope.houseSize,
            paid: false
          });
        });
      }
    });
  };

  $scope.payExpense = function(expenseName){
    db.on('value', function(snapshot){
      uExpenseDb = snapshot.val().users[currentUserId].userExpenses;
      for (expense in uExpenseDb){
        if (uExpenseDb[expense].name === expenseName){
          console.log('paying ', expenseName);
          db.child('users').child(currentUserId).child('userExpenses').child(expense).update({
            paid: true
          });
        }
      }
    });
  }
})
.factory('DrawPie', function() {
  return {
    //showLabels true means each section has an arrow and description,
    //false means the key is under the graph
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
