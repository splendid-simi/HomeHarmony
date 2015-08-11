angular.module('homeHarmony.expenses', ['firebase'])

.controller('expensesCtrl', function($scope, $firebaseObject){
console.log("In expensesCtrl");
  var db = new Firebase("https://dazzling-inferno-3592.firebaseio.com");
  var expensesArr = [];
  var dataArr;
  var dataObj;
  //hard coded for now, should be set from the app
  var currentHouse = "-JwPcwYMViRlKqSZmnOw";

  // Attach an asynchronous callback to read the data at our posts reference
  db.once("value", function(snapshot) {
    // make sure dataArr is blank
    dataArr = [];
    // load the expenses for the current house
    expensesArr = snapshot.val().houses[currentHouse].expenses;
    for (var i = 0; i < expensesArr.length; i++) {
      // clear the dataObj
      dataObj = {};
      dataObj.name = expensesArr[i].expenseName;
      dataObj.y = expensesArr[i].cost;
      dataArr.push(dataObj);
    }
    // show the cool pie chart
    drawPie();
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });


  var drawPie = function () {
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
          data: dataArr
        }]
      });
    };
});
