require('dotenv').config();

const connections = {
    development: {
        http: {
            port: 3001,
        },
    },
    production: {
        http: {
            port: process.env.PORT || process.env.NODE_PORT || 3001,
        },
    },
};

module.exports = {
    connections: connections[process.env.NODE_ENV],
    secret: process.env.SECRET,
};
