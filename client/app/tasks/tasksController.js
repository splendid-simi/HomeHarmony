angular.module('homeHarmony.tasks', ['firebase', 'ngMessages'])

.controller('tasksCtrl', function($scope, $firebaseObject){

  var db = new Firebase("https://dazzling-inferno-3592.firebaseio.com");

  $scope.tasks = {};
  $scope.tasks.taskArr = [];
  $scope.tasks.compTaskArr = [];
  $scope.tasks.sortByDateArr = [];
  $scope.tasks.currentDate = new Date();

  currentHouseId = localStorage.getItem('currentHouseId');
  currentUserId = localStorage.getItem("currentUserId");
  var taskDb = {};

  $scope.tasks.addTask = function() {
    taskObj = {
      description: $scope.tasks.newTask,
      doer: $scope.tasks.newTaskDoer,
      // due date must be string to be stored in database 
      dueDate: $scope.tasks.newTaskDueDate.toString(),  
      dateCreated: new Date(),
      completed: false,
      repeating: -1
    }

    // pushes task into database 
    db.child('houses').child(currentHouseId).child('tasks').push(taskObj);

    db.child('houses').child(currentHouseId).child('tasks').once('child_added', function(snapshot){
      taskId = snapshot.key();
      console.log(taskId);
      $scope.tasks.taskArr = [];

      // updates view with new tasks
      $scope.tasks.taskArr.push(snapshot.val());
      $scope.tasks.getTasks();
    })
    $scope.tasks.clearTasksForm();
  };

  $scope.tasks.getTasks = function() {
    // listen for a task to be added 
    db.once('value', function(snapshot){
      var temp = snapshot.val();
      console.log(temp, 'temp');
      console.log(currentHouseId, 'CHID in getTasks');
      var temp2 = temp.houses[currentHouseId];
      taskDb = temp2.tasks;

      // overrides current tasks in the array
      $scope.tasks.taskArr = [];
      for (prop in taskDb) {
          // limits completed tasks that will appear on the page to 12
        if (taskDb[prop].completed && $scope.tasks.compTaskArr.length <= 12) {
          $scope.tasks.sortCompTaskByDate.push(taskDb[prop]);
          $scope.tasks.compTaskArr = $scope.tasks.sortByDate(sortCompTaskByDate);
        } else if (!taskDb[prop].completed) {
          $scope.tasks.sortByDateArr.push(taskDb[prop]);
          // sorts and displays date in descending order 
          $scope.tasks.taskArr = $scope.tasks.sortByDate($scope.tasks.sortByDateArr);
        }
        console.log('gotten tasks ', $scope.tasks.taskArr); 
      }
    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    })
  };

  $scope.tasks.sortByDate = function(arr) {
    var sortedArr = arr.sort(function(a,b) { return Date.parse(a.dueDate) > Date.parse(b.dueDate) });
    return sortedArr;
  }

  $scope.tasks.checkOffTask = function(taskID) {
    db.child('houses').child(currentHouseId).child('tasks').child(taskID).set({'completed': true});
  };

  $scope.tasks.checkOnTask = function(taskID) {
    db.child('houses').child(currentHouseId).child('tasks').child(taskID).set({'completed': false});
  };

  $scope.tasks.clearTasksForm = function() {
    $scope.tasks.newTask = '';
    $scope.tasks.newTaskDoer = '';
    $scope.tasks.newTaskDueDate = '';
    // resets form to not trigger error validation after form has been submitted
    $scope.tasks.tasksForm.$setPristine();
  };

  $scope.tasks.getTasks();
})
