angular.module('homeHarmony.default', ['firebase'])

.controller('defaultCtrl', function($scope, $firebaseObject, $q){
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

  $scope.drawPie = function () {
    $('#expGraph').highcharts( {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: ''
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          },
          showInLegend: true
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
