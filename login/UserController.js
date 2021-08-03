const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Comic = require('../models/Comic');





class UserController {
  // get /register
    register(req,res) {
        var loggedIn = req.user
        var admin = false
        if(loggedIn){
            if(req.user.role === 'admin'){
                admin = true
            }
        }
        res.render('register',{
            loggedIn,
            admin
        });
    }
    // post /register
    async createUser(req,res) {
        
        let registerUsername = req.body.registerUsername;
        let registerPassword = req.body.registerPassword;
        let confirmPassword = req.body.confirmPassword;
        
        
        
        let acceptRegisterUsername = 0;
        let acceptRegisterPassword = 0;
        let acceptConfirmPassword = 0;
        let banned = false;
        let registerErr = false;
        if(!registerUsername){
            registerUsername = 0;
        }else if(registerUsername.length >6){
            const nameExist = await User.findOne({username: registerUsername});
            if(nameExist){
                acceptRegisterUsername = 1;
                if(nameExist.banned === true){
                    banned = true;
                    registerErr = true;
                    res.render('log-in',{
                        banned,
                        registerErr
                    })
                }else{
                    registerErr = true;
                    res.render('log-in',{
                        acceptRegisterUsername,
                        registerErr
                    })
                }
            }else{
                acceptRegisterUsername = 3;
            }
        }else{
            acceptRegisterUsername = 2;
        }
        if(!registerPassword){
            registerPassword = 0;
        }else if(registerPassword.length >6){
            acceptRegisterPassword = 3;
        }else{
            acceptRegisterPassword = 2;
        }
        if(!confirmPassword){
            confirmPassword = 0;
        }else if(registerPassword === confirmPassword){
            acceptConfirmPassword = 3;
        }else{
            acceptConfirmPassword = 1;
        }
        if(registerUsername == 0 || acceptRegisterUsername == 1 || acceptRegisterUsername == 2 || registerPassword == 0 || acceptRegisterPassword == 2 || confirmPassword == 0 || acceptConfirmPassword == 1){
            registerErr = true;
            res.render('log-in',{
                registerErr,
                registerUsername,
                registerPassword,
                confirmPassword,
                acceptRegisterUsername,
                acceptRegisterPassword,
                acceptConfirmPassword,
                
            })
        }else{
            req.body.role = 'user'
            req.body.banned = 'false'
            req.body.avatar = 'chuacohinh'
            const {registerUsername,registerPassword: plainTextPassword} = req.body;
            const registerPassword = await bcrypt.hash(plainTextPassword, 10);

            const user = new User({
                displayname:registerUsername,
                username:registerUsername,
                password:registerPassword,
                role:req.body.role,
                banned:req.body.banned,
                avatar:req.body.avatar
            })
                try {
                    user.save();
                    res.redirect('/login')
                } catch (err) {
                        res.status(400).send(err)
                }
        }

    }
    
    // get /login
    login(req,res) {
            res.render('log-in');
    }
    // get /test-user
    testUser(req, res){
        var loggedIn = req.user
        let name = req.user.displayname
        var admin = false
        let avatar = req.user.avatar
        if(loggedIn){
            if(req.user.role === 'admin'){
                admin = true
            }
        }
        
        res.render('test-user', {
                loggedIn,
                name,
                admin,
                avatar
        })
            
    }
    testCallback(req,res){
        res.send('day la callback')
    }
    //post
    async loginUser(req,res,next){
        let username = req.body.username;
        let password = req.body.password;
        let wrongPassword = false;
        let wrongUsername = false;
        let banned = false
        if(!username) {
            username = 0
        }
        if(!password){
            password = 0
        }
        if(username && password){
            const user = await User.findOne({username: username});
            if(user){
                if(user.banned === true){
                    banned = true
                    res.render('log-in', {
                        banned
                    });
                }else{
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
    
    googleCallback(req, res, next){
        res.send('day la callback');
    }
    logout(req, res, next){
        req.logOut();
        res.redirect('/login'); //Inside a callback… bulletproof!
      
    }
    checkLogin(req, res, next){
        if(req.isAuthenticated() && req.user.banned === false){
            return next()
        }
        res.redirect('/login')
    }

    followComic(req, res, next){
        
        User.findOneAndUpdate({username: req.user.username},
        {
            $addToSet:{
                followComics: req.params.slug
            }
        })
        .then(user => {
            
            res.redirect('back')
        })
    
        
        
    }
    unFollowComic(req, res, next){
        
        User.findOneAndUpdate({username: req.user.username},
            {
                $pull:{
                    followComics: req.params.slug
                }
            })
            .then(user => {
                
                res.redirect('back')
            })
    }
    likeComic(req, res, next){
        Comic.findOneAndUpdate({slug :req.params.slug}, 
            {
                $inc : {
                    likeCounts : 1
                }
            })
            .then(user => {
                console.log(user.likeCounts)
            })
            

        User.findOneAndUpdate({username: req.user.username},
            {
                $addToSet:{
                    likeComics: req.params.slug
                }
            })
            .then(user => {
                
                res.redirect('back')
            })
            
                
    }
    unlikeComic(req, res, next){
        Comic.findOneAndUpdate({slug :req.params.slug}, 
            {
                $inc : {
                    likeCounts : -1
                }
            })
            .then(user => {
                console.log(user.likeCounts)
            })

        User.findOneAndUpdate({username: req.user.username},
            {
                $pull:{
                    likeComics: req.params.slug
                }
            })
            .then(user => {
                
                res.redirect('back')
            })
    }
    dislikeComic(req, res, next){
        Comic.findOneAndUpdate({slug :req.params.slug}, 
            {
                $inc : {
                    dislikeCounts : 1
                }
            })
            .then(user => {
                console.log(user.dislikeCounts)
            })
        User.findOneAndUpdate({username: req.user.username},
            {
                $addToSet:{
                    dislikeComics: req.params.slug
                }
            })
            .then(user => {
                
                res.redirect('back')
            })
    }
    undislikeComic(req, res, next){
        Comic.findOneAndUpdate({slug :req.params.slug}, 
            {
                $inc : {
                    dislikeCounts : -1
                }
            })
            .then(user => {
                console.log(user.dislikeCounts)
            })

        User.findOneAndUpdate({username: req.user.username},
            {
                $pull:{
                    dislikeComics: req.params.slug
                }
            })
            .then(user => {
                
                res.redirect('back')
            })
    }
    
}
module.exports = new UserController();