var test = require("node:test");
var assert = require("node:assert/strict");
var files = require("../src/files");

test("readUserFile reads a safe relative file", function () {
  var contents = files.readUserFile("readme.txt");
  assert.match(contents, /hello from safe file/);
});

test("readUserFile rejects path traversal", function () {
  assert.throws(function () {
    files.readUserFile("../package.json");
  }, /Invalid path/);
});
