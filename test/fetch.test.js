var test = require("node:test");
var assert = require("node:assert/strict");
var { fetchUrl, isAllowedUrl } = require("../src/fetch");

test("isAllowedUrl permits localhost targets", function () {
  assert.equal(isAllowedUrl("http://127.0.0.1:3000/"), true);
  assert.equal(isAllowedUrl("http://localhost:3000/"), true);
});

test("isAllowedUrl rejects external and unsafe URLs", function () {
  assert.equal(isAllowedUrl("http://169.254.169.254/"), false);
  assert.equal(isAllowedUrl("https://evil.example/"), false);
  assert.equal(isAllowedUrl("file:///etc/passwd"), false);
  assert.equal(isAllowedUrl("http://127.0.0.1@evil.example/"), false);
});

test("fetchUrl rejects disallowed URLs before requesting", function () {
  return fetchUrl("http://169.254.169.254/").then(
    function () {
      assert.fail("expected fetchUrl to reject disallowed URL");
    },
    function (err) {
      assert.match(String(err.message), /URL not allowed/);
    }
  );
});
