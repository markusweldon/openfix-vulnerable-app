var test = require("node:test");
var assert = require("node:assert/strict");
var fs = require("node:fs");
var path = require("node:path");
var axiosUtils = require("axios/lib/utils");

var PATCHED_FLOOR = "0.21.2";
var VULNERABLE_VERSION = "0.21.1";

function parseVersion(version) {
  var match = String(version).match(/^(\d+)\.(\d+)\.(\d+)/);
  assert.ok(match, "expected semver like 0.21.2, got " + version);
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
  return lock.packages["node_modules/axios"].version;
}

test("axios is pinned and installed at a patched version for CVE-2021-3749", function () {
  var declared = require("../package.json").dependencies.axios;
  var installed = require("axios/package.json").version;
  var locked = readLockedVersion();

  assert.notEqual(
    declared,
    VULNERABLE_VERSION,
    "package.json must not pin the known-vulnerable axios " + VULNERABLE_VERSION
  );
  assert.ok(
    isAtLeast(declared, PATCHED_FLOOR),
    "declared axios must be >= " + PATCHED_FLOOR
  );
  assert.ok(
    isAtLeast(locked, PATCHED_FLOOR),
    "package-lock.json must resolve axios >= " + PATCHED_FLOOR
  );
  assert.ok(
    isAtLeast(installed, PATCHED_FLOOR),
    "installed axios must be >= " + PATCHED_FLOOR
  );
  assert.equal(
    declared,
    locked,
    "package.json and package-lock.json must agree on axios version"
  );
  assert.equal(
    locked,
    installed,
    "lockfile and node_modules must agree on axios version"
  );
});

test("axios trim rejects CVE-2021-3749 vulnerable regex pattern", function () {
  var trimSource = axiosUtils.trim.toString();

  assert.ok(
    trimSource.indexOf("replace(/^\\s*/") === -1,
    "patched axios must not use the vulnerable /^\\s*/ trim replacement"
  );
  assert.ok(
    trimSource.indexOf("replace(/\\s*$/") === -1,
    "patched axios must not use the vulnerable /\\s*$/ trim replacement"
  );
});

test("axios trim handles whitespace without ReDoS-prone backtracking", function () {
  var payload = " " + " ".repeat(50000);
  var start = Date.now();
  var result = axiosUtils.trim(payload);
  var elapsed = Date.now() - start;

  assert.equal(result, payload.trim());
  assert.ok(
    elapsed < 500,
    "trim on large whitespace input must finish quickly (took " + elapsed + "ms)"
  );
});
