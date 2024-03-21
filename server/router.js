const api = require('./api');
const mid = require('./middleware');

const router = (app) => {
    // Constants
    app.get("/api", mid.requiresSecure, api.api);
    app.get("/default", mid.requiresSecure, api.defaultPage);
    app.get("/notFound", mid.requiresSecure, api.notFound);

    app.get("/", mid.requiresSecure, api.defaultPage);
    app.get("/*", mid.requiresSecure, api.notFound);
};

module.exports = router;