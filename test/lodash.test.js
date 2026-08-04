var test = require("node:test");
var assert = require("node:assert/strict");
var fs = require("node:fs");
var path = require("node:path");
var _ = require("lodash");

var PATCHED_FLOOR = "4.17.21";
var VULNERABLE_VERSION = "4.17.15";

function parseVersion(version) {
  var match = String(version).match(/^(\d+)\.(\d+)\.(\d+)/);
  assert.ok(match, "expected semver like 4.17.21, got " + version);
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

function isAtLeast(version, floor) {
  var current = parseVersion(version);
  var minimum = parseVersion(floor);
  if (current.major !== minimum.major) {
    return current.major > minimum.major;
  }
  if (current.minor !== minimum.minor) {
    return current.minor > minimum.minor;
  }
  return current.patch >= minimum.patch;
}

function readLockedVersion() {
  var lockPath = path.join(__dirname, "..", "package-lock.json");
  var lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
  return lock.packages["node_modules/lodash"].version;
}

test("lodash is pinned and installed at a patched version for CVE-2021-23337", function () {
  var declared = require("../package.json").dependencies.lodash;
  var installed = require("lodash/package.json").version;
  var locked = readLockedVersion();

  assert.notEqual(
    declared,
    VULNERABLE_VERSION,
    "package.json must not pin the known-vulnerable lodash " + VULNERABLE_VERSION
  );
  assert.ok(
    isAtLeast(declared, PATCHED_FLOOR),
    "declared lodash must be >= " + PATCHED_FLOOR
  );
  assert.ok(
    isAtLeast(locked, PATCHED_FLOOR),
    "package-lock.json must resolve lodash >= " + PATCHED_FLOOR
  );
  assert.ok(
    isAtLeast(installed, PATCHED_FLOOR),
    "installed lodash must be >= " + PATCHED_FLOOR
  );
  assert.equal(
    declared,
    locked,
    "package.json and package-lock.json must agree on lodash version"
  );
  assert.equal(
    locked,
    installed,
    "lockfile and node_modules must agree on lodash version"
  );
});

test("lodash template rejects CVE-2021-23337 variable injection", function () {
  var executed = false;
  global.__openfixLodashCveProbe = function () {
    executed = true;
  };

  try {
    var compiled = _.template("", {
      variable: 'x=(function(){return global.__openfixLodashCveProbe()})()',
    });
    compiled();
  } catch (err) {
    assert.match(
      String(err.message),
      /Invalid `variable` option/,
      "patched lodash should reject malicious template variable options"
    );
  } finally {
    delete global.__openfixLodashCveProbe;
  }

  assert.equal(
    executed,
    false,
    "CVE-2021-23337 template injection probe must not execute on lodash >= " +
      PATCHED_FLOOR
  );
});
