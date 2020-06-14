// This is a health checker http server
// if this is running, the bot is probably healthy
// if this is down, the bot is probably down
const express = require("express");
const PORT = process.env.PORT || 8080;

express()
  .get("/", (req, res) => res.send("ok"))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
