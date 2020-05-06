const bcrypt = require("bcryptjs");

module.exports = (req, res, next) => {
    // check that we remembered the client and is logged in already
    // console.log("session", req.session);
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({ you: "Shall not pass" });
    }
};

//when using sessions, the information is saved in the server
//the cookie  only needs the session id.
