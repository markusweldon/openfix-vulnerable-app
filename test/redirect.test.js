var test = require("node:test");
var assert = require("node:assert/strict");
var http = require("node:http");
var { nextUrl } = require("../src/redirect");
var app = require("../src/server");

test("nextUrl preserves site-local absolute paths", function () {
  assert.equal(nextUrl("/dashboard?tab=profile#settings"), "/dashboard?tab=profile#settings");
});

test("nextUrl rejects external and ambiguous redirect targets", function () {
  [
    "https://evil.example/fake-login",
    "//evil.example/fake-login",
    "/\\evil.example/fake-login",
    "javascript:alert(1)",
    "dashboard",
    "",
    null,
  ].forEach(function (target) {
    assert.equal(nextUrl(target), "/", String(target));
  });
});

test("/go only redirects to site-local paths", async function (t) {
  var server = await listen();
  t.after(function () {
    return new Promise(function (resolve, reject) {
      server.close(function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  var externalResponse = await request(
    server,
    "/go?next=" + encodeURIComponent("https://evil.example/fake-login"),
  );
  assert.equal(externalResponse.statusCode, 302);
  assert.equal(externalResponse.headers.location, "/");

  var localResponse = await request(
    server,
    "/go?next=" + encodeURIComponent("/dashboard?tab=profile"),
  );
  assert.equal(localResponse.statusCode, 302);
  assert.equal(localResponse.headers.location, "/dashboard?tab=profile");
});

function listen() {
  return new Promise(function (resolve, reject) {
    var server = app.listen(0, "127.0.0.1", function () {
      resolve(server);
    });
    server.on("error", reject);
  });
}

function request(server, path) {
  return new Promise(function (resolve, reject) {
    var address = server.address();
    var req = http.get(
      {
        host: "127.0.0.1",
        port: address.port,
        path: path,
      },
      function (res) {
        res.resume();
        res.on("end", function () {
          resolve(res);
        });
      },
    );
    req.on("error", reject);
  });
}
