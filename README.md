# confi-coder

## description

confidential file encoder and decoder with MD5 and bitwise encription method.

## usage

1. Node Module

configure `CODER_KEY`, default `ENCODED_PATH` and default `DECODED_PATH` within `./src/config.js`

```js
const { encode, decode } = require("./src/coder.js");
decode();  // or decode(fromPath, toPath);
encode();  // or encode(fromPath, toPath);
```

2. Cli

configure `CODER_KEY`, default `ENCODED_PATH` and default `DECODED_PATH` within `./src/config.js`

```bash
npm run decode
# or `npm run decode from=... to=...`
npm run encode
# or `npm run encode from=... to=...`
```
set `CODER_KEY`:
```bash
# Unix shell:
CODER_KEY=... npm run decode
# Win32:
set CODER_KEY=... & npm run decode
```

**Note**
+ `ENCODED_PATH`: the encoded file path. default should be in `lib`, which will be checked in github
+ `DECODED_PATH`: the decoded file path. default should be in `dist`, which will be ignored by github
+ `CODER_KEY`: the priority of `CODER_KEY`: explicit key > `process.env` > `config.KEY`
