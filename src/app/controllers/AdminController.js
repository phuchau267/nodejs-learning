const User = require('../models/User');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const TimeDifferent = require('../../util/timeDiff')
const Comic = require('../models/Comic');


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
            User.countDocuments({banned: 'true'},(err, bannedCount) => {

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
        User.find({role : 'extraAdmin',banned: false})
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
            User.countDocuments({banned: true},(err, count) => {
                
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
    storedComics(req, res, next) {
        var loggedIn = req.user
        var admin = false
        if(loggedIn){
            if(req.user.role === 'admin'){
                admin = true
            }
        }
        Promise.all([Comic.find({}), Comic.countDocumentsDeleted()])
            .then(([comics, deletedCount]) => 
                res.render('stored-comics', {
                    loggedIn,
                    deletedCount,
                    comics: mutipleMongooseToObject(comics),
                    admin
                })
            )
            .catch(next);

        
    }

    trashedComics(req, res, next) {
        var loggedIn = req.user
        var admin = false
        if(loggedIn){
            if(req.user.role === 'admin'){
                admin = true
            }
        }
        Comic.findDeleted({})
            .then((comics) =>
                res.render('trashed-comics', {
                    loggedIn,
                    comics: mutipleMongooseToObject(comics),
                    admin
                }),
            )
            .catch(next);
    }   
    usersHandleFormAction(req, res, next){
        switch(req.body.action){
            case 'ban':
                User.updateMany({ _id: { $in: req.body.userIds}},{banned: true}) //vi li do minh gui array len nen minh can chuyen no qua dung dang cua trong document
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'delete-forever':
                User.deleteMany({ _id: { $in: req.body.userIds}}) //vi li do minh gui array len nen minh can chuyen no qua dung dang cua trong document
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'addAdmin':
                User.updateMany({ _id: { $in: req.body.userIds}},{role: "extraAdmin"}) //vi li do minh gui array len nen minh can chuyen no qua dung dang cua trong document
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'unAdmin':
                User.updateMany({ _id: { $in: req.body.userIds}},{role: "user"}) //vi li do minh gui array len nen minh can chuyen no qua dung dang cua trong document
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'unBan':
                User.updateMany({ _id: { $in: req.body.userIds}},{banned: false}) //vi li do minh gui array len nen minh can chuyen no qua dung dang cua trong document
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({message: 'dit me m'})   ; 
        }
    }
    comicsHandleFormAction(req, res, next){
        switch(req.body.action){
            case 'delete':
                Comic.delete({ _id: { $in: req.body.comicIds}}) //vi li do minh gui array len nen minh can chuyen no qua dung dang cua trong document
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'delete-forever':
                Comic.deleteMany({ _id: { $in: req.body.comicIds}}) //vi li do minh gui array len nen minh can chuyen no qua dung dang cua trong document
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'restore':
                Comic.restore({ _id: { $in: req.body.comicIds}}) //vi li do minh gui array len nen minh can chuyen no qua dung dang cua trong document
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({message: 'dit me m'})   ; 
        }
    }
}
module.exports = new AdminController();