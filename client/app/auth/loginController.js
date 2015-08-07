angular.module('homeHarmony.login',[])

.controller('LoginCtrl', function ($scope, $location, UserAuth) {
  $scope.logInUser = function(){
    console.log(UserAuth);
    UserAuth.login($scope.email, $scope.password);
  };
  console.log($scope);
});
