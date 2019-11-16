const proxy = require("http-proxy-middleware");

module.exports = app => {
  app.use(
    "/api",
    proxy({
      target: "https://localhost:8000",
      changeOrigin: true
    })
  );
};