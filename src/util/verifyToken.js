const jwt = require('jsonwebtoken')
const User = require('../app/models/User');

class roleValidation {

    async checkLogin(req,res,next) {
        const token = req.cookies.token
        if (!token) return res.status(401).send('ban chua dang nhap')

        try {
            const userID = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET );
            const user = await User.findOne({_id: userID})
            if(user){
                req.user = user;
                next();
            }else{
                res.send('tai khoan ko hop le')
            }
            
            
        } catch (error) {
            res.status(400).send('invalid token');
        }
    }

    customer(req,res,next) {
        const role = req.user.role;
        if(role == 1){
            next();
        }else{
            res.send('tai khoan ko cho phep')
        }
    }

}
module.exports = new roleValidation();