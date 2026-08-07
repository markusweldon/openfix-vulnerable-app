var test = require("node:test");
var assert = require("node:assert/strict");
var { listDir } = require("../src/listdir");

test("listDir lists a directory without shell interpretation", function () {
  return listDir(".").then(function (output) {
    assert.match(output, /total \d+/);
  });
});

test("listDir passes user path as argv, not via shell", function () {
  var injectionPath = ".; echo injected";
  return listDir(injectionPath).then(
    function () {
      assert.fail("expected ls to reject a non-existent path");
    },
    function (err) {
      assert.ok(err);
    }
  );
});
