const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('auth-token');
    if(!token){
        return res.json({message: 'No token, authorization denied'});
    }
    try{
        const decode = jwt.verify(token, 'mysecretkey')
        req.user = decode.user;
        next();
    }catch(err){
        res.json({message: 'token not valid'})
    }
}