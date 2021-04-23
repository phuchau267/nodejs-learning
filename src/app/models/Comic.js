const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');



const Comic = new Schema({
    name: {type: String, required: true},
    description: {type: String},
    image: {type: String},
    videoId: {type: String, required: true},
    level: {type: String},
    slug: {type: String, unique: true },
    likeCounts:{type: Number},
    dislikeCounts:{type: Number}
  }, {
    timestamps: true
  });



// Add plugin 
mongoose.plugin(slug);
Comic.plugin(mongooseDelete, {
      deletedAt: true,
      overrideMethods: 'all', 
  });

//  "Course ben trai la ten cua model tuc la ten cua 1 cuc database cua minh no se tu dong viet thuong va them s"
  module.exports = mongoose.model('comics', Comic);// ben phai la ten cua schema ma dung de gui vao collection mang ten ben trai
