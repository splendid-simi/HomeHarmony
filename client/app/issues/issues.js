angular.module('homeHarmony.issues',['firebase'])

.controller('issuesCtrl', function ($scope, $q){
  var db = new Firebase("https://dazzling-inferno-3592.firebaseio.com");
  currentHouseId = localStorage.getItem('currentHouseId');
  currentUserId = localStorage.getItem("currentUserId");
  var allIssues;
  var issuesDb = {};
  

  $scope.addIssue = function(){
    $('#issueField').val('');
    var now = new Date();
    newIssue = {
      date: (now.getMonth() + 1) + '/' + now.getDate() + '/' +  now.getFullYear(),
      text: $scope.issueText
    };
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

  $scope.removeIssue = function(issueText){
    // console.log("issue index ",index);
    db.on('value', function(snapshot){
      issuesDb = snapshot.val().houses[currentHouseId].issues;
      for (issue in issuesDb){
        if (issuesDb[issue].text === issueText){
          console.log('deleting issues with ', issueText);
          db.child('houses').child(currentHouseId).child('issues').child(issue).remove();
        }
      }
      
    });
  };

  $scope.getIssues();
});


