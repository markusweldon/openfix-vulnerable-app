var test = require("node:test");
var assert = require("node:assert/strict");
var { fetchUrl, validateFetchUrl } = require("../src/fetch");

test("validateFetchUrl allows localhost targets", function () {
  assert.equal(
    validateFetchUrl("http://127.0.0.1:3000/"),
    "http://127.0.0.1:3000/"
  );
  assert.equal(
    validateFetchUrl("http://localhost:3000/health"),
    "http://localhost:3000/health"
  );
});

test("validateFetchUrl rejects external hosts", function () {
  assert.throws(function () {
    validateFetchUrl("http://evil.example/");
  }, /URL host not allowed/);
});

test("validateFetchUrl rejects cloud metadata endpoints", function () {
  assert.throws(function () {
    validateFetchUrl("http://169.254.169.254/latest/meta-data/");
  }, /URL host not allowed/);
});

test("validateFetchUrl rejects non-http schemes", function () {
  assert.throws(function () {
    validateFetchUrl("file:///etc/passwd");
  }, /URL scheme not allowed/);
});

test("fetchUrl rejects disallowed URLs before requesting", function () {
  return assert.rejects(fetchUrl("http://attacker.example/"), /URL host not allowed/);
});
