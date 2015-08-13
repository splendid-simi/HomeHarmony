angular.module('homeHarmony.issues',['firebase'])

.controller('issuesCtrl', function ($scope, $q){
  var db = new Firebase("https://dazzling-inferno-3592.firebaseio.com");
  currentHouseId = localStorage.getItem('currentHouseId');
  currentUserId = localStorage.getItem("currentUserId");
  var allIssues;
  var issuesDb = {};
  

  $scope.addIssue = function(){
    newIssue = $scope.issueText;
    db.child('houses').child(currentHouseId).child('issues').push(newIssue);
  };

  $scope.getIssues = function(){
    db.on('value', function(snapshot){
      var dbValues = snapshot.val();
      var thisHouse = dbValues.houses[currentHouseId];
      issuesDb = thisHouse.issues;
      allIssues = [];
      for (issue in issuesDb){
        allIssues.push(issuesDb[issue]);
      }
      $q.all(allIssues).then(function(){
      $scope.allIssues = allIssues;
    });
      console.log("All issues:", $scope.allIssues);
    });
  };

  $scope.getIssues();
});


