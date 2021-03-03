
// class thi viet hoa chu cai dau

class SiteController {
    index(req, res, next) {
        res.render('home');

    }

    // /news/:slug (slug chi la ten goi cua cai route nho~ tuy` bien)
    search(req, res) {
        res.render('search');
    }
}

module.exports = new SiteController();
