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

function resolveKey() {
  const { CODER_KEY } = process.env;
  const key = CODER_KEY || KEY;
  if (!key) throw new Error("Please give CODER_KEY or configure KEY in config.js");
  return key;
}

async function decode() {
  if (!Fs.existsSync(ENCODED_PATH)) {
    throw new Error(`${ENCODED_PATH} is missing`);
  }
  if (!Fs.existsSync(DECODED_PATH)) {
    await mkdir(Path.dirname(DECODED_PATH), { recursive: true }).catch(err => {
      throw err;
    });
  }
  return coder(resolveKey(), ENCODED_PATH, DECODED_PATH);
}

async function encode() {
  if (!Fs.existsSync(DECODED_PATH)) {
    throw new Error(`${DECODED_PATH} is missing`);
  }
  if (!Fs.existsSync(ENCODED_PATH)) {
    await mkdir(Path.dirname(ENCODED_PATH), { recursive: true }).catch(err => {
      throw err;
    });
  }
  return coder(resolveKey(), DECODED_PATH, ENCODED_PATH);
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
  console.log(`${fgGreen}${fgBright}   -- finished${reset}`);
  return "finished";
}

module.exports = {
  default: coder,
  decode,
  encode,
  resolveKey
};
