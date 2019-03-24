const MD5 = require("md5.js");
const Promise = require("bluebird");
const Fs = require("fs");
const Path = require("path");
const { ENCODED_PATH, DECODED_PATH, KEY } = require("./config");

const readFile = Promise.promisify(Fs.readFile);
const writeFile = Promise.promisify(Fs.writeFile);
const mkdir = Promise.promisify(Fs.mkdir);
const fgGreen = "\x1b[32m";
const fgBright = "\x1b[1m";
const reset = "\x1b[0m";

/**
 * resolve `CODER_KEY`, priority order: argument key > process.env.CODER_KEY > config.KEY
 */
function resolveKey(key) {
  if (key) return key;
  const { CODER_KEY } = process.env;
  key = CODER_KEY || KEY;
  if (!key) throw new Error("Please give CODER_KEY or configure KEY in config.js");
  return key;
}

async function decode(encodedPath = ENCODED_PATH, decodedPath = DECODED_PATH, key) {
  if (!Fs.existsSync(encodedPath)) {
    throw new Error(`${encodedPath} is missing`);
  }
  if (!Fs.existsSync(decodedPath)) {
    await mkdir(Path.dirname(decodedPath), { recursive: true }).catch(err => {
      throw err;
    });
  }
  return coder(resolveKey(key), encodedPath, decodedPath);
}

async function encode(decodedPath = DECODED_PATH, encodedPath = ENCODED_PATH, key) {
  if (!Fs.existsSync(decodedPath)) {
    throw new Error(`${decodedPath} is missing`);
  }
  if (!Fs.existsSync(encodedPath)) {
    await mkdir(Path.dirname(encodedPath), { recursive: true }).catch(err => {
      throw err;
    });
  }
  return coder(resolveKey(key), decodedPath, encodedPath);
}

async function coder(key, from, to) {
  const c = new MD5().update(key).digest("hex");
  const _key = Buffer.from(c).reduce((prev, x) => prev + x, 0);
  const buf = await readFile(from).catch(err => {
    throw err;
  });
  const _buf = buf.map(x => x ^ _key);
  await writeFile(to, _buf).catch(err => {
    throw err;
  });
  console.log(`${fgGreen}${fgBright}   -- code from ${from} to ${to} finished${reset}`);
  return 0;
}

module.exports = {
  default: coder,
  decode,
  encode,
  resolveKey
};
