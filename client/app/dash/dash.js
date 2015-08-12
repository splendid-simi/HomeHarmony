angular.module('homeHarmony.dash',[])

.controller('dashCtrl', function ($scope,UserAuth) {

  currentHouseId = localStorage.getItem('currentHouseId');
  currentUserId = localStorage.getItem("currentUserId");

  $scope.logOut = function(){
    console.log('Logging out.');
    UserAuth.logout();
  };

});
