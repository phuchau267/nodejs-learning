const Course = require('../models/Course');
const { mutipleMongooseToObject } = require('../../util/mongoose');

class MeController {
    // GET /me/stored/courses
    storedCourses(req, res, next) {

        Promise.all([Course.find({}), Course.countDocumentsDeleted()])
            .then(([courses, deletedCount]) => 
                res.render('stored-courses', {
                    deletedCount,
                    courses: mutipleMongooseToObject(courses)
                })
            )
            .catch(next);

        
    }

    trashCourses(req, res, next) {
        Course.findDeleted({})
            .then((courses) =>
                res.render('trash-courses', {
                    courses: mutipleMongooseToObject(courses),
                }),
            )
            .catch(next);
    }   


}

module.exports = new MeController();
