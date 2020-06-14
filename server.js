// This is a health checker http server
// if this is running, the bot is probably healthy
// if this is down, the bot is probably down

const http = require("http");

function getHandler(req, res, reqUrl) {
  res.writeHead(200);
  res.write("OK");
  res.end();
}

function noResponse(req, res) {
  res.writeHead(404);
  res.end();
}

http
  .createServer((req, res) => {
    const router = {
      "GET/": getHandler,
      default: noResponse,
    };

    let reqUrl = new URL(req.url, process.env.HOST);

    let redirectedFunc =
      router[req.method + reqUrl.pathname] || router["default"];
    redirectedFunc(req, res, reqUrl);
  })
  .listen(process.env.PORT || 8080, () => {
    console.log("Server is running at 0.0.0.0:" + (process.env.PORT || 8080));
  });
