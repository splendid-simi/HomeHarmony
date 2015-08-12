angular.module('homeHarmony.expenses', ['firebase'])

.controller('expensesCtrl', function($scope, $firebaseObject){
console.log("In expensesCtrl");
  var db = new Firebase("https://dazzling-inferno-3592.firebaseio.com");
  var expensesDb;
  $scope.expensesArr;
  var dataObj;

  // get the date so user can't enter an expense due before today
  $scope.currentDate = new Date();

  // Attach an asynchronous callback to read the data at our posts reference
  db.once("value", function(snapshot) {
    // make sure dataArr is blank
    $scope.expensesArr = [];
    // load the expenses for the current house
    expensesDb = snapshot.val().houses[currentHouseId].expenses;
    console.log("expenses",snapshot.val().houses[currentHouseId].expenses)
    for (expense in expensesDb){
      dataObj = {};
      dataObj.name = expensesDb[expense].expenseName;
      dataObj.y = expensesDb[expense].cost;
      $scope.expensesArr.push(dataObj);
    }
    // show the cool pie chart
    $scope.drawPie();
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

  $scope.newExpense = function(){
    console.log('new Expense called');
    $('#expenseName').val('');
    $('#expenseCost').val('');
    $('#expenseDate').val('');
    db.child('houses').child(currentHouseId).child('expenses')
    .push({
      expenseName: $scope.expenseName,
      dueDate: $('#expenseDate').val(), // We need to parse the date when it comes from the db because of this
      cost: $scope.expenseCost,
      paid: false
    });
  };

  $scope.drawPie = function () {
    $('#container').highcharts( {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'Monthly Expenses'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
            }
          }
        }
      },
      series: [{
        name: "Expenses",
        colorByPoint: true,
        data: $scope.expensesArr
      }]
    });
  };
});
