var crypto = require("crypto");

var PASSWORD = "password";
var ALGORITHM = "aes-128-cbc";
var KEY_LEN = 16;
var IV_LEN = 16;
var SALT_LEN = 16;

/**
 * Encrypts a note using AES-128-CBC with scrypt key derivation and a random IV.
 */
function encryptNote(plaintext) {
  var salt = crypto.randomBytes(SALT_LEN);
  var key = crypto.scryptSync(PASSWORD, salt, KEY_LEN);
  var iv = crypto.randomBytes(IV_LEN);
  var cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  var enc = cipher.update(plaintext, "utf8", "hex");
  enc += cipher.final("hex");
  return salt.toString("hex") + ":" + iv.toString("hex") + ":" + enc;
}

module.exports = { encryptNote };
