const Course = require('../models/Course');
const { mutipleMongooseToObject } = require('../../util/mongoose');

class MeController {
    // GET /me/stored/courses
    storedCourses(req, res, next) {
        var loggedIn = req.user
        var admin = false
        if(loggedIn){
            if(req.user.role === 'admin'){
                admin = true
            }
        }
        Promise.all([Course.find({}), Course.countDocumentsDeleted()])
            .then(([courses, deletedCount]) => 
                res.render('stored-courses', {
                    loggedIn,
                    deletedCount,
                    courses: mutipleMongooseToObject(courses),
                    admin
                })
            )
            .catch(next);

        
    }

    trashCourses(req, res, next) {
        var loggedIn = req.user
        var admin = false
        if(loggedIn){
            if(req.user.role === 'admin'){
                admin = true
            }
        }
        Course.findDeleted({})
            .then((courses) =>
                res.render('trash-courses', {
                    loggedIn,
                    courses: mutipleMongooseToObject(courses),
                    admin
                }),
            )
            .catch(next);
    }   


}

module.exports = new MeController();
