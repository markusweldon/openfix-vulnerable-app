var test = require("node:test");
var assert = require("node:assert/strict");
var pkg = require("lodash/package.json");

test("lodash is at least 4.17.21 (CVE-2021-23337)", function () {
  var parts = pkg.version.split(".").map(Number);
  var min = [4, 17, 21];
  for (var i = 0; i < min.length; i++) {
    if (parts[i] > min[i]) return;
    if (parts[i] < min[i]) {
      assert.fail("lodash " + pkg.version + " is below 4.17.21");
    }
  }
});
