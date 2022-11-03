const { createProxyMiddleware } = require("http-proxy-middleware");

const HOST = "192.168.1.2:4000";

const config = {
    target: `http://${HOST}`,
    changeOrigin: true,
};

module.exports = function (app) {
    app.use(
        "/socket/websocket",
        createProxyMiddleware({ ...config, ws: true })
    );
    app.use("/api", createProxyMiddleware(config));
    app.use("/public", createProxyMiddleware(config));
    app.use("/bucket", createProxyMiddleware(config));
};
