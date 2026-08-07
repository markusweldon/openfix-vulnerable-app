var { execFile } = require("child_process");

var HOST_PATTERN = /^[a-zA-Z0-9.-]+$/;

/**
 * Ping a host without shell interpolation (user input passed as argv only).
 */
function pingHost(host) {
  if (!HOST_PATTERN.test(host)) {
    return Promise.reject(new Error("Invalid host"));
  }
  return new Promise(function (resolve, reject) {
    execFile("ping", ["-c", "1", host], function (err, stdout, stderr) {
      if (err) return reject(err);
      resolve(stdout || stderr);
    });
  });
}

module.exports = { pingHost };
