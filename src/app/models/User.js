const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');
const moment = require('moment-timezone');
const opts = {
    // set lại time zone sang asia
    timestamps: { currentTime: () => moment.tz(Date.now(), "Asia/Bangkok") },
};
const User = new Schema({
    email:{type: String, required: true},
    username:{type: String, required: true},
    password:{type: String, required: true},
    role:{type: String},
    banned:{type: Boolean},
    likedComic: [{comicName: String}],
    userCreatedAt:{type: String},
    userUpdatedAt:{type: String},
}, opts);

User.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all', 
});
module.exports = mongoose.model('users', User);