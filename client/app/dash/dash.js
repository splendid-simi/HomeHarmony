angular.module('homeHarmony.dash',[])

.controller('dashCtrl', function ($scope) {
  // Initializes Materialize Sidebar
  $('.button-collapse').sideNav({
    menuWidth: 200, // Default is 240
    closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
  });
});
