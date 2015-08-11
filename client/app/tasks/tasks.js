angular.module('homeHarmony.tasks', ['firebase'])

.controller('tasksCtrl', function($scope, $firebaseObject){

  var db = new Firebase("https://dazzling-inferno-3592.firebaseio.com");
  $scope.taskArr = [];
  var taskDb = {};

  $scope.addTask = function() {
    taskObj = {
      description: $scope.newTask,
      doer: $scope.newTaskDoer,
      dueDate: $scope.newTaskDueDate,
      dateCreated: new Date(),
      completed: false,
      repeating: -1
    }
    db.child('houses').child(currentHouseId).child('tasks').push(taskObj);

    db.child('houses').child(currentHouseId).child('tasks').on('child_added', function(snapshot){
      taskId = snapshot.key();
      console.log(taskId);
      // get tasks
      $scope.taskArr.push(snapshot.val());
      console.log('tasks ', $scope.taskArr);
    })
  };

  $scope.getTasks = function() {
    db.on('value', function(snapshot){
      var temp = snapshot.val()
      console.log(temp, 'temp');
      console.log(currentHouseId, 'CHID in getTasks');
      var temp2= temp.houses[currentHouseId];
      console.log('temp2 ', temp2)
      taskDb = temp2.tasks;  //check later
      for (prop in taskDb) {
        $scope.taskArr.push(taskDb[prop]);
        console.log('gotten tasks ', $scope.taskArr)
      }
      // $scope.tasks = taskArr;
    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    })
  };

  $scope.checkOffTask = function(taskID) {
    db.child('houses').child(currentHouseId).child('tasks').child(taskID).set({'completed': true});
  }

  $scope.checkOnTask = function(taskID) {
    db.child('houses').child(currentHouseId).child('tasks').child(taskID).set({'completed': false});
  }

  $scope.getTasks();
})
