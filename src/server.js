var express = require("express");
var files = require("./files");
var tokens = require("./auth/tokens");

var app = express();

app.get("/", function (req, res) {
  res.send("openfix vulnerable demo");
});

app.get("/echo", function (req, res) {
  // Intentionally unsafe: reflects unsanitized input (XSS finding)
  var name = req.query.name || "world";
  res.send("<h1>Hello " + name + "</h1>");
});

app.get("/file", function (req, res) {
  try {
    var contents = files.readUserFile(req.query.path);
    res.type("text/plain").send(contents);
  } catch (err) {
    res.status(400).send(String(err.message || err));
  }
});

app.get("/token-hint", function (req, res) {
  res.json({ hasToken: Boolean(tokens.API_TOKEN) });
});

if (require.main === module) {
  app.listen(3000, function () {
    console.log("listening on :3000");
  });
}

module.exports = app;
