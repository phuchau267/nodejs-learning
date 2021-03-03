// class thi viet hoa chu cai dau

class NewsController {
    index(req, res) {
        res.render('news');
    }

    // /news/:slug (slug chi la ten goi cua cai route nho~ tuy` bien)
    show(req, res) {
        res.send('news details');
    }
}

module.exports = new NewsController();
