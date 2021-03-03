module.exports = {
    mutipleMongooseToObject: function (mongoose){        // cai o tren la xai khi muon show ra tat ca product
        return mongoose.map(mongoose => mongoose.toObject());
    },
    mongooseToObject: function (mongoose) {                 // cai o duoi la xai khi vao 1 cai product
        return mongoose ? mongoose.toObject() : mongoose;
    }
};
//su dung handlebars la phai co cai nay