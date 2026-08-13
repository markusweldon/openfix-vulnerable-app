var http = require("http");
var https = require("https");

var ALLOWED_HOSTS = ["127.0.0.1", "localhost"];

function isAllowedUrl(urlString) {
  var parsed;
  try {
    parsed = new URL(urlString);
  } catch (err) {
    return false;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return false;
  }
  if (parsed.username || parsed.password) {
    return false;
  }
  return ALLOWED_HOSTS.indexOf(parsed.hostname) !== -1;
}

function fetchUrl(url) {
  if (!isAllowedUrl(url)) {
    return Promise.reject(new Error("URL not allowed"));
  }

  var parsed = new URL(url);
  var client = parsed.protocol === "https:" ? https : http;

  return new Promise(function (resolve, reject) {
    client
      .get(url, function (res) {
        var data = "";
        res.on("data", function (chunk) {
          data += chunk;
        });
        res.on("end", function () {
          resolve(data);
        });
      })
      .on("error", reject);
  });
}

module.exports = { fetchUrl, isAllowedUrl };
