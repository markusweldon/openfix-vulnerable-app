var test = require("node:test");
var assert = require("node:assert/strict");
var minimist = require("minimist");
var pkg = require("minimist/package.json");

test("minimist meets patched version for CVE-2021-44906", function () {
  var parts = pkg.version.split(".").map(Number);
  var major = parts[0];
  var minor = parts[1];
  var patch = parts[2];
  assert.ok(
    major > 1 || (major === 1 && (minor > 2 || (minor === 2 && patch >= 6))),
    "expected minimist >= 1.2.6, got " + pkg.version
  );
});

test("minimist does not allow prototype pollution via __proto__", function () {
  var argv = ["--__proto__.polluted", "yes"];
  minimist(argv);
  assert.equal(Object.prototype.polluted, undefined);
});
