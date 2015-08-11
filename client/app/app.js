var totalDb = {};
var userDb = {};
var currentUser = 'DEFAULT_USER';
var currentUserId = 'DEFAULT_USER_ID';
var currentHouseId = 'DEFAULT_HOUSE_ID';
var needsHouseFor = [
  'dash',
  'dash.default',
  'issues',
  'expenses',
  'dash.tasks'
];

angular.module('homeHarmony', [
  'ui.router',
  'homeHarmony.auth',
  'homeHarmony.newUser',
  'homeHarmony.login',
  'homeHarmony.newHouse',
  'homeHarmony.dash',
  'homeHarmony.expenses',
  'homeHarmony.tasks'
])
.config(function($stateProvider, $urlRouterProvider) {
  // Set up the states
  $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: "./app/auth/login.html",
      controller: 'LoginCtrl',
      controllerAs: 'login'
    })
    .state('landing', {
      url: "/landing",
      templateUrl: "./app/landing/landing.html",
      // controller: 'LandingCtrl',
      // controllerAs: 'landing',
    })
    .state('newUser', {
      url: "/newUser",
      templateUrl: "./app/auth/newUser.html",
      controller: 'NewUserCtrl',
      controllerAs: 'newUser'
    })
    .state('issues', {
      url: "/issues",
      templateUrl: "./app/issues/issues.html",
      // controller: "issuesCtrl"
    })
    .state('expenses', {
      url: "/expenses",
      templateUrl: "./app/expenses/expenses.html",
      controller: "expensesCtrl"
    })
    .state('dash', {
      url: "/dash",
      templateUrl: "./app/dash/dash.html",
      controller: "dashCtrl",
      resolve: {
        // controller will not be loaded until $waitForAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function(Auth) {
          // $waitForAuth returns a promise so the resolve waits for it to complete
          return Auth.$requireAuth();
        }]
      }
    })
    // nested views for dash
    .state('dash.default', {
      url: "/:default",
      templateUrl: "./app/dash/partials/default.html",
      // controller: "defaultCtrl"
      resolve: {
        // controller will not be loaded until $waitForAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function(Auth) {
          // $waitForAuth returns a promise so the resolve waits for it to complete
          return Auth.$requireAuth();
        }]
      }
    })
    .state('dash.newHouse', {
      url: "/:newHouse",
      templateUrl: "./app/dash/partials/newHouse.html",
      controller: "newHouseCtrl",
      resolve: {
        // controller will not be loaded until $waitForAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function(Auth) {
          // $waitForAuth returns a promise so the resolve waits for it to complete
          return Auth.$requireAuth();
        }]
      }
    })
    .state('dash.tasks', {
      url: "/:tasks",
      templateUrl: "./app/tasks/tasks.html",
      controller: "tasksCtrl"
    })

  // For any unmatched url, redirect to /
  $urlRouterProvider.otherwise("/landing");
})
.run(["$rootScope", "$state", function($rootScope, $state) {
  $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams) {
    if (currentHouseId === 'DEFAULT_HOUSE_ID'){
      if (needsHouseFor.indexOf(toState.name) >= 0){
        $state.go('dash.newHouse');
      }
    }
  });

  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
    event.preventDefault();
    if (error === "AUTH_REQUIRED") {
      $state.go("login");
    }
  });

}]);

