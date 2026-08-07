var test = require("node:test");
var assert = require("node:assert/strict");
var fs = require("node:fs");
var path = require("node:path");

test("ws dependency is patched for CVE-2021-32640 (>=7.4.6)", function () {
  var pkgPath = path.join(__dirname, "..", "node_modules", "ws", "package.json");
  assert.ok(fs.existsSync(pkgPath), "ws must be installed");
  var installed = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  var parts = installed.version.split(".").map(Number);
  var minimum = [7, 4, 6];
  var ok =
    parts[0] > minimum[0] ||
    (parts[0] === minimum[0] && parts[1] > minimum[1]) ||
    (parts[0] === minimum[0] && parts[1] === minimum[1] && parts[2] >= minimum[2]);
  assert.ok(ok, "ws " + installed.version + " is below 7.4.6");
});
