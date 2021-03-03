const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const Cookies = require('js-cookie');




class UserController {
    signup(req,res) {
        
        res.render('sign-up');
    }

    async createUser(req,res) {
        
        let hadUsername = req.body.username;
        let hadPassword = req.body.password;
        let hadConfirmPassword = req.body.ConfirmPassword;
        let hadEmail = req.body.email;
        let notEmail = false;
        let checkEmailExist = false;
        let checkNameExist = false;
        let checkConfirmPass = false;
        let acceptEmail = false;
        let acceptUsername = false;
        let acceptPassword = false;
        let acceptConfirmPass = false;
        if(!hadEmail){
            hadEmail = 0
        }else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(hadEmail)){
            notEmail = true
        }else{
            var emailExist = await User.findOne({email: hadEmail})
            if(emailExist){
                checkEmailExist = true
            }
        }
        if(!hadUsername){
            hadUsername = 0
        }else{
            var nameExist = await User.findOne({username: hadUsername})
            if(nameExist){
                checkNameExist = true
            }
        }
        if(!hadPassword){
            hadPassword = 0
        }
        if(!hadConfirmPassword){
            hadConfirmPassword = 0
        }
        if(hadPassword != 0 && hadConfirmPassword != 0){
            if(hadPassword === hadConfirmPassword){
                checkConfirmPass = true;
            }
        }
        
        
        let usernameLength = hadUsername.length;
        let passwordLength = hadPassword.length;

        if(notEmail == false && checkEmailExist == false){
            acceptEmail = true
        }
        if(hadUsername != 0 && usernameLength > 6 && checkNameExist == false){
            acceptUsername = true
        }
        if(hadPassword != 0 && passwordLength > 6){
            acceptPassword = true
        }
        
        
        if(hadUsername == 0 || hadPassword == 0 || hadConfirmPassword == 0 || usernameLength <= 6 || passwordLength <=6 || notEmail == true || hadEmail == 0 || checkEmailExist == true || checkNameExist == true || checkConfirmPass == false){
            res.render('sign-up', {
                notEmail,
                hadEmail,
                checkEmailExist,
                acceptEmail,
                hadUsername,
                acceptUsername,
                hadPassword,
                acceptPassword,
                hadConfirmPassword,
                checkConfirmPass,
                usernameLength,
                passwordLength,
                checkNameExist
            })
            
        }else{
            
            

            const {email,username, password: plainTextPassword,role} = req.body;
            const password = await bcrypt.hash(plainTextPassword, 10);

            const user = new User({
                email,
                username,
                password,
                role,
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
        res.render('log-in');
    }

    //post loginUser
    async loginUser(req,res){
        let userExist = 0;
        let passExist = 0;
        let loginUsername = req.body.username;
        let loginPassword = req.body.password;
        let wrongAcc = false;
        if(!loginUsername){
            loginUsername = 0
        }
        if(!loginPassword){
            loginPassword = 0
        }
        if(loginUsername && loginPassword){
            const user = await User.findOne({username: loginUsername})
            if(user){
                
                const validPass = await bcrypt.compare(loginPassword, user.password)
                if(validPass){
                    try {
                        const token = jwt.sign({ _id: user.id},'jwakldjwakljtuia');
                        res.cookie('token',token, {httpOnly: true, maxAge:24 * 60 * 60 * 1000});
                        res.redirect('/')
                    } catch (error) {
                        res.send(error)
                    }
                }else{
                    passExist = 2
                }
            }else{
                userExist = 2
            }
        }
        if(userExist == 2 || passExist == 2){
            wrongAcc = true
        }
        
        if(loginUsername == 0 || loginPassword == 0 || userExist == 2 || passExist == 2 || wrongAcc == true){
            res.render('log-in',{
                loginUsername,
                loginPassword,
                userExist,
                passExist,
                wrongAcc
            })
        }
        
    }
}
module.exports = new UserController();