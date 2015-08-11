angular.module('homeHarmony.issues',['firebase'])

.controller('issuesCtrl', function ($scope){
  var db = new Firebase("https://dazzling-inferno-3592.firebaseio.com");
  $scope.allIssues = [];
  var issuesDb = {};

  $scope.addIssue = function(){
    newIssue = $scope.issueText;
    db.child('houses').child(currentHouseId).child('issues').push(newIssue);
  };

  $scope.getIssues = function(){
    console.log("Getting issues");
    db.on('value', function(snapshot){
      var dbValues = snapshot.val();
      var thisHouse = dbValues.houses[currentHouseId];
      issuesDb = thisHouse.issues;
      console.log(issuesDb);
      for (issue in issuesDb){
        $scope.allIssues.push(issuesDb[issue]);
      }
      console.log("All issues:", $scope.allIssues);
    });
  };
});