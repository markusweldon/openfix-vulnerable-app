var test = require("node:test");
var assert = require("node:assert/strict");
var minimistPkg = require("minimist/package.json");

test("minimist meets minimum patched version for CVE-2021-44906", function () {
  var parts = minimistPkg.version.split(".").map(Number);
  var major = parts[0];
  var minor = parts[1];
  var patch = parts[2];

  assert.ok(
    major > 1 || (major === 1 && (minor > 2 || (minor === 2 && patch >= 6))),
    "minimist must be >= 1.2.6 (found " + minimistPkg.version + ")"
  );
});
