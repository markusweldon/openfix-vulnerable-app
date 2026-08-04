var test = require("node:test");
var assert = require("node:assert/strict");
var pkg = require("../package.json");

test("lodash dependency is patched for CVE-2021-23337", function () {
  var version = pkg.dependencies.lodash;
  assert.match(version, /^\d+\.\d+\.\d+$/);

  var parts = version.split(".").map(Number);
  var major = parts[0];
  var minor = parts[1];
  var patch = parts[2];

  var isPatched =
    major > 4 ||
    (major === 4 && minor > 17) ||
    (major === 4 && minor === 17 && patch >= 21);

  assert.ok(isPatched, "lodash must be >= 4.17.21 (was vulnerable at 4.17.15)");
});
