const path = require('path');
const express = require("express");
const morgan = require("morgan");
const bodyParser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redis = require('redis');

const config = require('./config.js');
const router = require('./router.js');

const PORT = process.env.PORT || 3000;

// const redisClient = redis.createClient({
//     legacyMode: false,
//     url: config.connections.redis,
// });
// redisClient.connect().catch(console.error).then(() => { console.log("Connected to redis database!\n") });

const app = express();

app.use(morgan("tiny"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(session({
//     key: 'sessionid',
//     store: new RedisStore({
//         client: redisClient,
//     }),
//     secret: config.secret,
//     resave: true,
//     saveUninitialized: true,
//     cookie: {
//         httpOnly: true,
//     },
// }));

app.use('/src', express.static(path.join(__dirname, '../client/src')));

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
}

router(app);

app.listen(PORT, () => {
    console.clear();
    console.log(`Server listening on port ${PORT}\n`);
});