const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../app/models/User');

module.exports = function (passport) {
    passport.use(new LocalStrategy(
        function(username, password, done) {
          User.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
              return done(null, false);
            }
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;

                if(isMatch){
                    return done(null, user);
                    
                }else{
                    return done(null, false)
                }
            })
          });
        }
    ));

    passport.serializeUser(function(user, done) {
        console.log("serialize user");
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          console.log("de-serialize user")
          done(err, user);
        });
      });
}