var http = require("http");
var https = require("https");

var ALLOWED_HOSTS = new Set(["127.0.0.1", "localhost", "[::1]"]);

function validateFetchUrl(urlString) {
  if (typeof urlString !== "string" || urlString.length === 0) {
    throw new Error("Invalid URL");
  }

  var parsed;
  try {
    parsed = new URL(urlString);
  } catch (err) {
    throw new Error("Invalid URL");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("URL scheme not allowed");
  }

  if (parsed.username || parsed.password) {
    throw new Error("URL credentials not allowed");
  }

  var host = parsed.hostname.toLowerCase();
  if (!ALLOWED_HOSTS.has(host)) {
    throw new Error("URL host not allowed");
  }

  return parsed.href;
}

function fetchUrl(url) {
  var safeUrl;
  try {
    safeUrl = validateFetchUrl(url);
  } catch (err) {
    return Promise.reject(err);
  }

  return new Promise(function (resolve, reject) {
    var client = safeUrl.startsWith("https:") ? https : http;
    client
      .get(safeUrl, function (res) {
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

module.exports = { fetchUrl, validateFetchUrl };
