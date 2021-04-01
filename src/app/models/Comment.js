const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');
const moment = require('moment-timezone');
const opts = {
    // set lại time zone sang asia
    timestamps: { currentTime: () => moment.tz(Date.now(), "Asia/Bangkok") },
  };
const Comment = new Schema({
    commentName:{type: String},
    comment:{type: String},
    commentSlug:{type: String}
}, opts);

Comment.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all', 
});
module.exports = mongoose.model('comments', Comment);