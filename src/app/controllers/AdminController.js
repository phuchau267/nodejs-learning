const User = require('../models/User');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const TimeDifferent = require('../../util/timeDiff')

class AdminController {
    users(req, res, next){
        var loggedIn = req.user
        var admin = false
        if(loggedIn){
            if(req.user.role === 'admin'){
                admin = true
            }
        }
        User.find({role : 'user', banned: false})
        .exec((err,users) => {
            User.count({banned: 'true'},(err, bannedCount) => {

                if (err) return next(err);
                users.map(user => {
                    let time = TimeDifferent(user.createdAt)
                    user["userCreatedAt"] = time
                    
                })
                res.render('stored-users',{
                    loggedIn,
                    bannedCount,
                    users: mutipleMongooseToObject(users),
                    admin
                })

            });
            
        });
    }
    extraAdmin(req, res, next){
        var loggedIn = req.user
        var admin = false
        if(loggedIn){
            if(req.user.role === 'admin'){
                admin = true
            }
        }
        User.find({role : 'extraAdmin'})
            .then(users => {
                users.map(user => {
                    let time = TimeDifferent(user.createdAt)
                    user["userUpdatedAt"] = time
                    
                })
                res.render('stored-extraAdmin',{
                    loggedIn,
                    users: mutipleMongooseToObject(users),
                    admin
                })
            })
    }
    //put
    unAdmin(req, res, next){
        User.updateOne({ _id: req.params.id},{role: 'user'})
            .then(() => res.redirect('/admin/extraAdmin'))
            .catch(next);
    }
    //put
    banAdmin(req, res, next){
        User.updateOne({ _id: req.params.id},{banned: true})
            .then(() => res.redirect('/admin/extraAdmin'))
            .catch(next);
    }
    //get /admin/banned
    banned(req, res, next){
        var loggedIn = req.user
        var admin = false
        if(loggedIn){
            if(req.user.role === 'admin'){
                admin = true
            }
        }
        User.find({banned: true})
        .exec((err,users) => {
            User.count({banned: false, role: 'user'},(err, count) => {
                console.log(count)
                if (err) return next(err);
                users.map(user => {
                    let time = TimeDifferent(user.updatedAt)
                    user["userUpdatedAt"] = time
                    
                })
                
                res.render('banned-users',{
                    loggedIn,
                    count,
                    users: mutipleMongooseToObject(users),
                    admin
                })

            });
            
        });
    }
    // put ban a user
    banUser(req, res, next){
        
        User.updateOne({ _id: req.params.id},{banned: true})
            .then(() => res.redirect('/admin/users'))
            .catch(next);
    }

    addAdmin(req, res, next){
        
        User.updateOne({ _id: req.params.id},{role: 'extraAdmin'})
            .then(() => res.redirect('/admin/users'))
            .catch(next);
    }

    unBan(req, res, next){
        User.updateOne({ _id: req.params.id},{banned: false})
            .then(() => res.redirect('back'))
            .catch(next);
    }

    deleteUser(req,res,next){
        User.deleteOne({ _id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
    }
    checkAdmin(req, res, next){
        if(req.user.role === 'admin'){
            next()
        }else{
            res.send('ban ko phai la admin')
        }

    }
    checkAllAdmin(req, res, next){
        if(req.user.role === 'admin' || req.user.role === 'extraAdmin'){
            next()
        }else{
            res.send('ban ko phai la admin')
        }

    }
}
module.exports = new AdminController();