var test = require("node:test");
var assert = require("node:assert/strict");
var lodashPkg = require("lodash/package.json");

test("lodash meets minimum patched version for CVE-2021-23337", function () {
  var parts = lodashPkg.version.split(".").map(Number);
  var major = parts[0];
  var minor = parts[1];
  var patch = parts[2];

  assert.equal(major, 4);
  assert.ok(
    minor > 17 || (minor === 17 && patch >= 21),
    "lodash must be >= 4.17.21 (found " + lodashPkg.version + ")"
  );
});
