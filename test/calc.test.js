var test = require("node:test");
var assert = require("node:assert/strict");
var { calculate } = require("../src/calc");

test("calculate evaluates basic arithmetic", function () {
  assert.equal(calculate("1+1"), 2);
  assert.equal(calculate("2*3+4"), 10);
  assert.equal(calculate("(2+3)*4"), 20);
});

test("calculate rejects non-arithmetic input", function () {
  assert.throws(function () {
    calculate("1+1; process.exit(1)");
  }, /Invalid expression/);
  assert.throws(function () {
    calculate("require('fs')");
  }, /Invalid expression/);
});
