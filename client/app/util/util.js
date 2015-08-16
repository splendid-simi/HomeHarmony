/**
 * Home Harmony Util
 * contains utility function(s) for database operations
 */
angular.module('homeHarmony.util', ['firebase'])

.factory('DButil', function() {
  // database reference
  var db = new Firebase("https://dazzling-inferno-3592.firebaseio.com");
  
  return {
    // returns the unique id for the user with the given email
    // returns 'DEFAULT_USER_ID' if invalid user
    getUserIdFromEmail: function(userEmail, cb) {
      db.once("value", function(snapshot) {
        usersDb = snapshot.val().users;
        resultId = 'DEFAULT_USER_ID';
        for (var uid in usersDb) {
          if (usersDb[uid].email === userEmail) {
            resultId = uid;
          }
        }
        cb(resultId); // callback function
      },
      function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    }
  };
});
