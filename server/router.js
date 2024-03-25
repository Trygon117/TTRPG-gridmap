const api = require('./api');
const mid = require('./middleware');

const router = (app) => {
    // Constants
    app.get("/api", mid.requiresSecure, api.api);
    app.get("/notFound", mid.requiresSecure, api.notFound);
    app.get("/index.css", mid.requiresSecure, api.clientCSS);
    app.get("/three", mid.requiresSecure, api.three);
    app.get("/camera-controls", mid.requiresSecure, api.cameraControls);


    app.get("/", mid.requiresSecure, api.defaultPage);
    app.get("/*", mid.requiresSecure, api.notFound);
};

module.exports = router;