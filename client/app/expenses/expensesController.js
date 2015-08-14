angular.module('homeHarmony.expenses', ['firebase'])

.controller('expensesCtrl', function($scope, $firebaseObject, $q, DrawPie, DButil){ 
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
      DrawPie.drawPie($scope, "Expense Analysis", true);
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
      var houseSize = Object.keys(houseMembers).length;
      for (memberId in houseMembers){
        DButil.getUserIdFromEmail(houseMembers[memberId], function(userId){
          db.child('users').child(userId).child('userExpenses').push({
            name: expense.expenseName,
            splitCost: expense.cost/houseSize,
            paid: false
          });
        });
      }
    });

  };

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
