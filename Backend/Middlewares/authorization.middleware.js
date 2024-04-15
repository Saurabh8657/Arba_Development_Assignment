const jwt = require('jsonwebtoken');
const { secretKey } = require('../Config/db');

const auth = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token)
    if(token) {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.send({ msg: 'Token is not valid' });
            } else {
                const userId = decoded.userId;
                req.body.userId = userId;
                console.log(req.body)
                next();
            }
        });
    } else {
        res.send({ msg: 'Please login first!' });
    }
};

module.exports = {
    auth
}