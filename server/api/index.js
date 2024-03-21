const path = require('path');

const defaultPage = (req, res) => {
    return notFound(req, res);
}

const indexJS = (req, res) => {
    return notFound(req, res);
}

const notFound = (req, res) => {
    return res.json({ message: "Not Found" });
}

module.exports = {
    indexJS,
    defaultPage,
    notFound
};