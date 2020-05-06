const bcrypt = require("bcryptjs");

const router = require("express").Router();

const Users = require("../users/users-model.js");

router.post("/register", (req, res) => {
    const userInfo = req.body;
    const ROUNDS = process.env.HASHING_ROUNDS || 8;
    //second number is rounds for crypting.  password will be hashed and rehashed 2^8 time v
    const hash = bcrypt.hashSync(userInfo.password, ROUNDS);
    userInfo.password = hash;
    Users.add(userInfo)
        .then((user) => {
            res.json(user);
        })
        .catch((err) => res.send(err));
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    Users.findBy({ username })
        //have to destructure user here because we do not use first in the helper function. because we may use the helper function to search for results in the array later, otherwise we would use first to pull this user.
        .then(([user]) => {
            console.log("user", user);
            if (user && bcrypt.compareSync(password, user.password)) {
                //remember the client
                req.session.user = {
                    id: user.id,
                    username: user.username,
                };

                res.status(200).json({ hello: user.username });
            } else {
                res.status(401).json({ Message: "invalid credentials" });
            }
        })
        .catch((err) => {
            res.status(500).json({ errorMessage: "error" });
        });
});
// awesome logout
router.get("/logout", (req, res) => {
    //this is just for sessions
    if (req.session) {
        req.session.destroy((error) => {
            //destroy does not need callback, but can have one
            if (error) {
                res.status(500).json({
                    message:
                        "you can checkout any time you like, but you can never leave",
                });
            } else {
                res.status(200).json({ message: "logged out successful" });
            } // callback ending here
        });
    } else {
        res.status(200).json({ message: "I don't know you " });
    }
});

module.exports = router;
