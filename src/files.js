var fs = require("fs");
var path = require("path");

function readUserFile(userPath) {
  if (typeof userPath !== "string" || userPath.length === 0) {
    throw new Error("Invalid path");
  }

  var base = path.resolve(path.join(__dirname, "..", "data"));
  var target = path.resolve(base, userPath);
  var relative = path.relative(base, target);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Invalid path");
  }

  return fs.readFileSync(target, "utf8");
}

module.exports = { readUserFile };
