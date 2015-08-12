angular.module('homeHarmony.tasks', ['firebase'])

.controller('tasksCtrl', function($scope, $firebaseObject){

  var db = new Firebase("https://dazzling-inferno-3592.firebaseio.com");
  $scope.taskArr = [];
  $scope.compTaskArr = [];
  var taskDb = {};
  currentHouseId = localStorage.getItem('currentHouseId');
  currentUserId = localStorage.getItem("currentUserId");


  $scope.addTask = function() {
    console.log("addtask");
    taskObj = {
      description: $scope.newTask,
      doer: $scope.newTaskDoer,
      dueDate: $scope.newTaskDueDate,
      dateCreated: new Date(),
      completed: false,
      repeating: -1
    }
    console.log(taskObj);
    db.child('houses').child(currentHouseId).child('tasks').push(taskObj);

    db.child('houses').child(currentHouseId).child('tasks').once('child_added', function(snapshot){
      taskId = snapshot.key();
      console.log(taskId);
      $scope.taskArr = [];
      // get tasks
      $scope.taskArr.push(snapshot.val());
      console.log('tasks ', $scope.taskArr);
      $scope.getTasks();
    })
  };

  $scope.getTasks = function() {
    db.once('value', function(snapshot){
      var temp = snapshot.val();
      console.log(temp, 'temp');
      console.log(currentHouseId, 'CHID in getTasks');
      var temp2 = temp.houses[currentHouseId];
      taskDb = temp2.tasks;
      $scope.taskArr = [];
      for (prop in taskDb) {
        if (taskDb[prop].completed) {
          $scope.compTaskArr.push(taskDb[prop]);
        } else {
          $scope.taskArr.push(taskDb[prop]);
        }
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
