const Comment = require('../models/Comment');
const TimeDifferent = require('../../util/timeDiff')
const { mutipleMongooseToObject , mongooseToObject } = require('../../util/mongoose');
class CommentController {
    postComment(req, res, next){
        
        let commentSlug = req.params.chapterSlug
        let username = req.user.username
        const comment = new Comment(req.body);
        comment.commentName = username;
        comment.commentSlug = commentSlug;
        comment.save()
                .then(() => {
                    Comment.find().sort({createdAt: -1})
                    .then(comments => {
                        
                        res.render('comment-ajax',{
                            layout: 'comment-ajax-layout',
                            comments:mutipleMongooseToObject(comments)
                        })
                    })
                })
    }
}
module.exports = new CommentController();