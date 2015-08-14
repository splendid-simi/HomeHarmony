angular.module('homeHarmony.tasks', ['firebase', 'ngMessages'])

.controller('tasksCtrl', function($scope, $firebaseObject, $q){

  var db = new Firebase("https://dazzling-inferno-3592.firebaseio.com");

  $scope.tasks = {};
  $scope.tasks.taskArr;
  $scope.tasks.compTaskArr;
  var sortCompTaskByDateArr;
  var sortByDateArr;
  $scope.tasks.currentDate = new Date();
  $scope.houseMemberArr = JSON.parse(localStorage.getItem('currentUsersArr'))
  currentHouseId = localStorage.getItem('currentHouseId');
  currentUserId = localStorage.getItem("currentUserId");
  var taskDb = {};

  $scope.tasks.addTask = function() {
    taskObj = {
      description: $scope.newTask,
      doer: $scope.newTaskDoer,
      // date must be string to be stored in database
      dueDate: new Date($scope.newTaskDueDate).toString(),
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
      $scope.tasks.compTaskArr = [];
      sortCompTaskByDateArr = [];
      sortByDateArr = [];

      for (prop in taskDb) {
        taskDb[prop].id = prop;
        if (taskDb[prop].completed) {
          sortCompTaskByDateArr.push(taskDb[prop]);
          $q.all(sortCompTaskByDateArr).then(function(){
            // displays 12 most recently completed tasks in descending order
            $scope.tasks.compTaskArr = $scope.tasks.sortByDate(sortCompTaskByDateArr);
          });
        } else if (!taskDb[prop].completed) {
          sortByDateArr.push(taskDb[prop])
          $q.all(sortByDateArr).then(function(){
            // sorts and displays date in descending order
            $scope.tasks.taskArr = $scope.tasks.sortByDate(sortByDateArr);
          });
        }
      }
        console.log('gotten tasks ', $scope.tasks.taskArr);
    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    })
  };

  // creates readable format for dates to display in view
  $scope.tasks.parseDate = function(taskObj) {
    for (task in taskObj) {
      taskObj[task].dueDateFormat = new Date(taskObj[task].dueDate).toLocaleDateString();
    }
    return taskObj;
  }

  $scope.tasks.sortByDate = function(arr) {
    if (arr.length > 0) {
      var sortedArr = arr.sort(function(a,b) { return Date.parse(a.dueDate) > Date.parse(b.dueDate) });
      return $scope.tasks.parseDate(sortedArr);
    } else {
      return arr[0];
    }
    return $scope.tasks.parseDate(arr);
  }

  $scope.tasks.checkTask = function(task) {
    console.log("task obj", task);
    console.log("check task was called");
    if (task.completed === false) {
      db.child('houses').child(currentHouseId).child('tasks').child(task.id).update({'completed': true});
    } else {
      db.child('houses').child(currentHouseId).child('tasks').child(task.id).update({'completed': false});
    }
    // re-render tasks so completed task will go to the bottom of the list
    $scope.tasks.getTasks();
  };

  $scope.tasks.clearTasksForm = function() {
    console.log("clear tasks fn called");
    $scope.newTask = '';
    $scope.newTaskDoer = '';
    $scope.newTaskDueDate = '';
    // resets form to not trigger error validation after form has been submitted
    $scope.tasksForm.$setPristine();
  };

  $scope.tasks.getTasks();
})
