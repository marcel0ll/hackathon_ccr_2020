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

    let reqUrl = new URL(req.url, "http://127.0.0.1/");

    let redirectedFunc =
      router[req.method + reqUrl.pathname] || router["default"];
    redirectedFunc(req, res, reqUrl);
  })
  .listen(80, () => {
    console.log("Server is running at http://127.0.0.1:80/");
  });
