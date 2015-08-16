/**
 * Home Harmony Dash
 * Controller for header on dashboard
 */
angular.module('homeHarmony.dash', [])

.controller('dashCtrl', function ($scope,UserAuth) {
  currentHouseId = localStorage.getItem('currentHouseId');
  currentUserId = localStorage.getItem("currentUserId");

  // Unauthorizes user
  $scope.logOut = function() {
    console.log('Logging out.');
    UserAuth.logout();
  };
});
