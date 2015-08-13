angular.module('homeHarmony.expenses', ['firebase'])

.controller('expensesCtrl', function($scope, $firebaseObject, $q){
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
      $scope.drawPie();
    });
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

  $scope.newExpense = function(){
    var date = $scope.expenseDate;
    $('#expenseName').val('');
    $('#expenseCost').val('');
    $('#expenseDate').val('');
    db.child('houses').child(currentHouseId).child('expenses')
    .push({
      expenseName: $scope.expenseName,
      dueDate: (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear(),
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
        text: 'Expenses Analysis'
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
