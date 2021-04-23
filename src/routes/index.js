const newsRouter = require('./news');
const siteRouter = require('./site');
const comicRouter = require('./comic');

const adminRouter = require('./admin');
const commentRouter = require('./comment');
// o day phai sap xep cai "/:slug" sau do toi "/" phai nam cuoi 
function route(app) {

    app.use('/comic', comicRouter);

    app.use('/news', newsRouter);

    app.use('/admin', adminRouter);

    app.use('/comment', commentRouter);

    app.use('/', siteRouter);
    
  
}

module.exports = route;
