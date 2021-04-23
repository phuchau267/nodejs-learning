const Comic = require('../models/Comic');
const Comment = require('../models/Comment');
const TimeDifferent = require('../../util/timeDiff')
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const shortid = require('shortid');
const removeVietnameseTones = require('../../util/slug-setting');
const { likedComic } = require('./UserController');
// class thi viet hoa chu cai dau



class ComicController {
    //get
        index(req, res, next) {
            var loggedIn = req.user
            var admin = false
            if(loggedIn){
            if(req.user.role === 'admin'){
                admin = true
            }
            }
            let page = +req.query.page || 1;
            let PageSize = 2;
            let skipComic = (page - 1)*PageSize;
            let nextPage = +page + 1;
            let prevPage = +page - 1;
            let prevPage2 = +page - 2;
            Comic
            .find()
            .skip(skipComic)
            .limit(PageSize)
            .exec((err,comics) => {
                Comic.countDocuments((err, count) => {
                    if (err) return next(err);
                    res.render('comics',{
                        loggedIn,
                        current: page,
                        nextPage,
                        prevPage,
                        prevPage2,
                        pages: Math.ceil(count/PageSize),
                        comics: mutipleMongooseToObject(comics),
                        admin
                    })

                });
                
            });
        }

        //get
    show(req, res, next) {
        let chapterSlug = req.params.slug
        var loggedIn = req.user
        
        var admin = false
        let alreadyFollowComic = false
        let alreadylikeComic = false
        let alreadydislikeComic = false
        if(req.user.role === 'admin'){
            admin = true
        }
        let followComics = req.user.followComics
        followComics.forEach(element =>{
            if(element == req.params.slug){
                alreadyFollowComic = true
            }
        })
        let likeComics = req.user.likeComics
        likeComics.forEach(element =>{
            if(element == req.params.slug){
                alreadylikeComic = true
            }
        })
        let dislikeComics = req.user.dislikeComics
        dislikeComics.forEach(element =>{
            if(element == req.params.slug){
                alreadydislikeComic = true
            }
        })
        
        Comic.findOne({ slug: req.params.slug })
            .then(comic => {
                
                if(comic){
                    let likeCounts = comic.likeCounts
                    let dislikeCounts = comic.dislikeCounts
                    Comment.find({commentSlug: req.params.slug}).sort({createdAt: -1})
                    .then(comments => {

                        console.log(chapterSlug)
                        res.render('comic-detail', {
                            likeCounts,
                            dislikeCounts,
                            alreadydislikeComic,
                            alreadylikeComic,
                            alreadyFollowComic,
                            comments: mutipleMongooseToObject(comments),
                            chapterSlug,
                            loggedIn,
                            comic: mongooseToObject(comic),
                            admin
                        });
                    })
                }
                
            })
            .catch(next);
    }
    //get
    create(req, res, next) {
        var loggedIn = req.user
        var admin = false
        if(loggedIn){
            if(req.user.role === 'admin'){
                admin = true
            }
        }
        res.render('create',{
            loggedIn,
            admin
        })
    }
    async store(req, res, next) {
        req.body.image = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;
        req.body.likeCounts = 0
        req.body.dislikeCounts = 0
        const slug = removeVietnameseTones(req.body.name);
        const comicExisted = await Comic.findOne({slug: slug})

        if(comicExisted){
            console.log('slug existed, add shortId to create new slug');
            const comic = new Comic(req.body);
            comic.slug = slug + '-' + shortid.generate();
            comic.save()
                .then(() => {
                res.status(201).redirect('/admin/storedComics');
                })
                .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
        }else{
            const comic = new Comic(req.body);
            comic.slug = slug;
            //save xong rồi redirect qua trang chủ
            comic.save()
                .then(() => {
                res.status(201).redirect('/admin/storedComics');
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
        var loggedIn = req.user
        var admin = false
        if(loggedIn){
            if(req.user.role === 'admin'){
                admin = true
            }
        }
        Comic.findById( req.params.id ) 
            .then(comic => {
                res.render('comic-edit', {
                    loggedIn,
                    comic: mongooseToObject(comic),
                    admin
                })
            })
            .catch(next);
    }

    // PUT /courses/:id
    update(req, res, next) {
        
        Comic.updateOne({ _id: req.params.id}, req.body)
            .then(() => res.redirect('/admin/storedComics'))
            .catch(next);
    }


    // delete /course/:id
    destroy(req, res, next) {
        Comic.delete({ _id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // delete /course/:id/force
    forcedestroy(req, res, next) {
        Comic.deleteOne({ _id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // PATCH /courses/:id/restore
    restore(req, res, next) {
        Comic.restore({ _id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // POST admin/courses/handle-form-action
    
}

module.exports = new ComicController();
