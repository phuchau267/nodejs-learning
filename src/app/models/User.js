const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

const User = new Schema({
    email:{type: String, required: true},
    username:{type: String, required: true},
    password:{type: String, required: true},
    role:{type: Number, required: true},
},{
    timestamps: true
});

User.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all', 
});
module.exports = mongoose.model('users', User);