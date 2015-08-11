angular.module('homeHarmony.dash',[])

.controller('dashCtrl', function ($scope,UserAuth) {
  $scope.logOut = function(){
    UserAuth.logout();
  };

});
