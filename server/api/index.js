const path = require('path');

const api = (req, res) => {
    return res.json({ message: "You've Reached the TTRPG Gridmap API" });
}

const defaultPage = (req, res) => {
    return notFound(req, res);
}

const notFound = (req, res) => {
    return res.json({ message: "Not Found" });
}

module.exports = {
    api,
    defaultPage,
    notFound
};