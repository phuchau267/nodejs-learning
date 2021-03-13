
// class thi viet hoa chu cai dau

class SiteController {
    index(req, res, next) {
        var loggedIn = req.user
        var admin = false
        if(loggedIn){
            if(req.user.role === 'admin'){
                admin = true
            }
        }
        
        
        res.render('home',{
            loggedIn,
            admin
        });

    }

    // /news/:slug (slug chi la ten goi cua cai route nho~ tuy` bien)
    search(req, res) {
        res.render('search');
    }
}

module.exports = new SiteController();
