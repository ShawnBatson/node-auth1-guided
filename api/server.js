const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
// persistance from here
const KnexSessionStore = require("connect-session-knex")(session); //needs the express session library to run

const dbConfig = require("../database/dbConfig");
// to here
const usersRouter = require("../users/users-router.js");
const authRouter = require("../auth/auth_router.js");
const restricted = require("../auth/restricted-middleware");

const server = express();

const sessionConfig = {
    name: "Cookie Monster",
    secret: "keep it secret, keep it safe",
    cookie: {
        maxAge: 1000 * 60 * 60, //duration of session/expiration
        secure: false, //true in production to send only over https
        httpOnly: true, //true means no access from javascript
    },
    resave: false,
    saveUninitialized: true, // GDPR laws require to checkwith client before

    // persistance here
    store: new KnexSessionStore({
        knex: dbConfig, // configured instance of knex
        createTable: true, // if the table does not exist, creates automatically
    }),
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

//insert restricted to restrict users
server.use("/api/users", restricted, usersRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
    res.json({ api: "up" });
});

module.exports = server;
