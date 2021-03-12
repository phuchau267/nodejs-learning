const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');






class UserController {
    // get /register
    register(req,res) {
        res.render('register');
    }
    // post /register
    async createUser(req,res) {
        let email = req.body.email;
        let username = req.body.username;
        let password = req.body.password;
        let confirmPassword = req.body.confirmPassword;
        let notEmail = false;
        let acceptEmail = 0;
        let acceptUsername = 0;
        let acceptPassword = 0;
        let acceptConfirmPassword = 0;

        if(!email){
            email = 0;
        }else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
            notEmail = true
        }else{
            const emailExist = await User.findOne({email: email});
            if(emailExist){
                acceptEmail = 1;
            }else{
                acceptEmail = 2;
            }
        }
        if(!username){
            username = 0;
        }else if(username.length >6){
            const nameExist = await User.findOne({username: username});
            if(nameExist){
                acceptUsername = 1;
            }else{
                acceptUsername = 2;
            }
        }else{
            acceptUsername = 3;
        }
        if(!password){
            password = 0;
        }else if(password.length >6){
            acceptPassword = 2;
        }else{
            acceptPassword = 1;
        }
        if(!confirmPassword){
            confirmPassword = 0;
        }else if(confirmPassword.length >6){
            if(password === confirmPassword){
                acceptConfirmPassword = 2;
            }else{
                acceptConfirmPassword = 3;
            }
        }else{
            acceptConfirmPassword = 1;
        }
        if(email == 0 || notEmail == true || acceptEmail == 1 || username == 0 || acceptUsername == 1 || acceptUsername == 3 || password == 0 || acceptPassword == 1 || confirmPassword == 0 || acceptConfirmPassword == 3 || acceptConfirmPassword == 1){
            res.render('register',{
                email,
                username,
                password,
                confirmPassword,
                notEmail,
                acceptEmail,
                acceptUsername,
                acceptPassword,
                acceptConfirmPassword,
                
            })
        }else{
            const {email,username, password: plainTextPassword} = req.body;
            const password = await bcrypt.hash(plainTextPassword, 10);

            const user = new User({
                email,
                username,
                password,
            })
                try {
                    user.save();
                    res.redirect('/')
                } catch (err) {
                        res.status(400).send(err)
                }
        }

    }
    
    // get /login
    login(req,res) {
        let loggedIn = req.user;
        if(loggedIn){
            return res.redirect('/')
        }else{
            res.render('log-in');
        }
        
    }
    testUser(req, res){
        let name = req.user
        if(!name){
            name = 0
        }else{
            name = req.user.username
        }
        res.render('test-user', {
            name
        })
    }
    loginBasic(req, res, next){
        
    }
    async loginUser(req,res,next){
        let username = req.body.username;
        let password = req.body.password;
        let wrongPassword = false;
        let wrongUsername = false;
        if(!username) {
            username = 0
        }
        if(!password){
            password = 0
        }
        if(username && password){
            const user = await User.findOne({username: username});
            if(user){
                const validPassword = await bcrypt.compare(password, user.password)
                if(validPassword){
                    passport.authenticate('local', function(err, user, info) {
                        if (err) { return next(err); }
                        if (!user) { return res.redirect('/login'); }
                        req.logIn(user, function(err) {
                          if (err) { 
                              return next(err); 
                            }else{
                                return res.redirect('/test-user')
                            }
                        });
                      })(req, res, next);
                }else{
                    wrongPassword = true
                }
            }else{
                wrongUsername = true
            }
        }
        if(username == 0 || password == 0 || wrongPassword == true || wrongUsername == true){
            res.render('log-in', {
                username,
                password,
                wrongPassword,
                wrongUsername,

            });
        }
    }

    logout(req, res, next){
        req.session.destroy(function (err) {
            res.redirect('/login'); //Inside a callback… bulletproof!
          });
    }
    checkLogin(req, res, next){
        if(req.isAuthenticated()){
            return next()
        }
        res.redirect('/login')
    }
}
module.exports = new UserController();