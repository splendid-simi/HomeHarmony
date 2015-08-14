angular.module('homeHarmony.util', ['firebase'])

.factory('DButil', function(){
  var db = new Firebase("https://dazzling-inferno-3592.firebaseio.com");
  return {

    getUserIdFromEmail: function(userEmail, cb){
      db.once("value", function(snapshot) {
        usersDb = snapshot.val().users;
        resultId = 'DEFAULT_USER_ID';
        for (uid in usersDb){
          if (usersDb[uid].email === userEmail){
            resultId = uid;
          }
        }
        cb(resultId);
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    },


  };
});