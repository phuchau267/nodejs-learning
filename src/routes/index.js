const newsRouter = require('./news');
const siteRouter = require('./site');
const courseRouter = require('./courses');
const meRouter = require('./me');
const adminRouter = require('./admin');
// o day phai sap xep cai "/:slug" sau do toi "/" phai nam cuoi 
function route(app) {

    app.use('/me', meRouter);

    app.use('/courses', courseRouter);

    app.use('/news', newsRouter);

    app.use('/admin', adminRouter);

    app.use('/', siteRouter);
    
  
}

module.exports = route;
