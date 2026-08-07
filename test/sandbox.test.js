var test = require("node:test");
var assert = require("node:assert/strict");
var { runUserScript } = require("../src/sandbox");

test("runUserScript evaluates safe arithmetic", function () {
  assert.equal(runUserScript("1+1"), 2);
  assert.equal(runUserScript("(2 + 3) * 4"), 20);
});

test("runUserScript rejects non-arithmetic input", function () {
  assert.throws(function () {
    runUserScript("process.mainModule.require('child_process')");
  }, /Invalid expression/);
});
