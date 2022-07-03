const db = require('../database/models');

async function userLoggedMiddleware (req,res,next){
    res.locals.isLogged = false;
    const emailInCookie = req.cookies.userEmail;
    const loggedUser = req.session.loggedUser
    console.log('Logged user:', emailInCookie);
    if(emailInCookie){
        const userFromCookie = await db.User.findOne({ where: {Email: emailInCookie}});
        if(userFromCookie !== null){
            req.session.loggedUser = userFromCookie;
            res.locals.isLogged = true;
            res.locals.loggedUser = userFromCookie;
            return next();
        }
    }
    if(loggedUser){ 
        res.locals.isLogged = true
       res.locals.loggedUser = loggedUser
        return next()
    }
    next();
        
}
module.exports = userLoggedMiddleware;