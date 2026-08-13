var fs = require("fs");
var path = require("path");

function readUserFile(userPath) {
  var base = path.resolve(path.join(__dirname, "..", "data"));
  var target = path.resolve(base, userPath);
  if (target !== base && !target.startsWith(base + path.sep)) {
    throw new Error("Invalid path");
  }
  return fs.readFileSync(target, "utf8");
}

module.exports = { readUserFile };
