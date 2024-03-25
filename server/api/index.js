const path = require('path');

const api = (req, res) => {
    return res.json({ message: "You've Reached the TTRPG Gridmap API" });
}

const defaultPage = (req, res) => {
    return res.sendFile(path.join(__dirname, '../../client/index.html'));
}

const clientJS = (req, res) => {
    return res.sendFile(path.join(__dirname, '../../client/index.js'));
}

const clientCSS = (req, res) => {
    return res.sendFile(path.join(__dirname, '../../client/index.css'));
}

const three = (req, res) => {
    return res.sendFile(path.join(__dirname, '../../node_modules/three/build/three.module.min.js'));
}

const cameraControls = (req, res) => {
    return res.sendFile(path.join(__dirname, '../../node_modules/camera-controls/dist/camera-controls.module.min.js'));
}

const notFound = (req, res) => {
    return res.json({ message: "Not Found" });
}

module.exports = {
    api,
    defaultPage,
    clientJS,
    clientCSS,
    three,
    cameraControls,
    notFound
};