const Course = require('../models/Course');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const shortid = require('shortid');
const removeVietnameseTones = require('../../util/slug-setting');
// class thi viet hoa chu cai dau



class CourseController {

    index(req, res, next) {
            let page = +req.query.page || 1;
            let PageSize = 2;
            let skipCourse = (page - 1)*PageSize;
            let nextPage = +req.query.page + 1 || 2;
            let prevPage = +req.query.page - 1;
            let prevPage2 = +req.query.page - 2;
            Course
            .find()
            .skip(skipCourse)
            .limit(PageSize)
            .exec((err,courses) => {
                Course.countDocuments((err, count) => {
                    if (err) return next(err);
                    res.render('courses',{
                        current: page,
                        nextPage,
                        prevPage,
                        prevPage2,
                        pages: Math.ceil(count/PageSize),
                        courses: mutipleMongooseToObject(courses)
                    })

                });
                
            });
    }

    show(req, res, next) {
        Course.findOne({ slug: req.params.slug })
            .then(course => {
                res.render('courses-detail', { 
                    course: mongooseToObject(course) 
                });
            })
            .catch(next);
    }
    
    create(req, res, next) {
        res.render('create')
    }
    async store(req, res, next) {
        req.body.image = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;
        const slug = removeVietnameseTones(req.body.name);
        const courseExisted = await Course.findOne({slug: slug})
        if(courseExisted){
            console.log('slug existed, add shortId to create new slug');
            const course = new Course(req.body);
            course.slug = slug + '-' + shortid.generate();
            course.save()
                .then(() => {
                res.status(201).redirect('/me/stored/courses');
                })
                .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
        }else{
            const course = new Course(req.body);
            course.slug = slug;
            //save xong rồi redirect qua trang chủ
            course.save()
                .then(() => {
                res.status(201).redirect('/me/stored/courses');
                })
                .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
        }
        // const course = new Course(req.body);
        // course.save()
        //     .then(() => res.redirect('/me/stored/courses'))
        //     .catch(next);
    }
    // GET /courses/:id/edit
    edit(req, res, next) {
        Course.findById( req.params.id ) 
            .then(course => {
                res.render('courses-edit', {
                    course: mongooseToObject(course) 
                })
            })
            .catch(next);
    }

    // PUT /courses/:id
    update(req, res, next) {
        
        Course.updateOne({ _id: req.params.id}, req.body)
            .then(() => res.redirect('/me/stored/courses'))
            .catch(next);
    }


    // delete /course/:id
    destroy(req, res, next) {
        Course.delete({ _id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // delete /course/:id/force
    forcedestroy(req, res, next) {
        Course.deleteOne({ _id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // PATCH /courses/:id/restore
    restore(req, res, next) {
        Course.restore({ _id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // POST /courses/handle-form-action
    handleFormAction(req, res, next){
        switch(req.body.action){
            case 'delete':
                Course.delete({ _id: { $in: req.body.courseIds}}) //vi li do minh gui array len nen minh can chuyen no qua dung dang cua trong document
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'delete-forever':
                Course.deleteMany({ _id: { $in: req.body.courseIds}}) //vi li do minh gui array len nen minh can chuyen no qua dung dang cua trong document
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'restore':
                Course.restore({ _id: { $in: req.body.courseIds}}) //vi li do minh gui array len nen minh can chuyen no qua dung dang cua trong document
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({message: 'dit me m'})   ; 
        }
    }
}

module.exports = new CourseController();
