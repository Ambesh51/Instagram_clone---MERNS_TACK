const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const User = require('../models/user');


const requireLogine = (req, res, next) => {
    // console.log(req.headers)
    const { authorization } = req.headers;
// //autherization === bearer nwefnwnfnewnun
    if (!authorization) { return res.status(401).json({ error: "Authentication Error" }) } //jverify token with Autherixzation
    const token = authorization.split(" ")[1];
    console.log(token)
    jwt.verify(token, JWT_SECRET, (err, payload) => {//verify token with JWT_SECRET
        if (err) { return res.status(401).json({ error: "Authorization Error" }) }//401 unautherization
        const { _id } = payload//destructer _id
        User.findById(_id).then(userdata => {
            req.user = userdata
        })
        next();
    })
}

module.exports = requireLogine;



//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     console.log(verified)
//     next();
//   }