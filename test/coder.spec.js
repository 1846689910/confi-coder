const Path = require("path");
const { expect } = require("chai");
const sinon = require("sinon");

/**
 * 1 自定义的需要有方法或属性被stub的module，和需要被test的并且使用前者module的module最好都能在自己的case中require，否则可能会无法正确替换
 * 2 需要被测试的module需要在stub之后再引入
 * 3 有时在每次测试后清空reqire.cache是必要的
 */
describe("coder", () => {
  let fakeConfig;
  describe("function resolveKey", () => {
    afterEach(() => {
      if (fakeConfig) {
        fakeConfig.restore();
        fakeConfig = null;
      }
      delete process.env.CODER_KEY;
      Object.keys(require.cache).forEach(key => delete require.cache[key]);
    });
    it("should use config.KEY if no CODER_KEY given", () => {
      fakeConfig = sinon.stub(require("../src/config"), "KEY").value("key");
      const { resolveKey } = require("../src/coder"); // needs to load self-defined module after stub, otherwise cannot stub property inside
      const key = resolveKey();
      expect(key).to.equal("key");
    });
    it("should use CODER_KEY if the env variable was given", () => {
      process.env.CODER_KEY = "123";
      const { resolveKey } = require("../src/coder");
      const key = resolveKey();
      expect(key).to.equal("123");
    });
    it("should throw error if no KEY in config and no CODER_KEY in process.env", () => {
      fakeConfig = sinon.stub(require("../src/config"), "KEY").value(undefined);
      const { resolveKey } = require("../src/coder");
      expect(resolveKey).to.throw();
    });
  });

  const decodedPath = Path.resolve("test", "__dist", "a.txt");
  const encodedPath = Path.resolve("test", "__lib", "a.encoded.txt");
  describe("function decode", () => {
    before(() => {
      const _config = require("../src/config");
      fakeConfig = sinon.stub(_config, "KEY").value("key");
      fakeConfig = sinon.stub(_config, "DECODED_PATH").value(decodedPath);
      fakeConfig = sinon.stub(_config, "ENCODED_PATH").value(encodedPath);
    });
    it("should throw error when encodedPath does not exist", async () => {
      const { decode } = require("../src/coder");
      let err;
      await decode().catch(e => (err = e));
      expect(err).to.exist;
      expect(err.message).to.equal(`${encodedPath} is missing`);
    });
  });
  describe("function encode", () => {
    before(() => {
      const _config = require("../src/config");
      fakeConfig = sinon.stub(_config, "KEY").value("key");
      fakeConfig = sinon.stub(_config, "DECODED_PATH").value(decodedPath);
      fakeConfig = sinon.stub(_config, "ENCODED_PATH").value(encodedPath);
    });
    it("should throw error when decodedPath does not exist", async () => {
      const { encode } = require("../src/coder");
      let err;
      await encode().catch(e => (err = e));
      expect(err).to.exist;
      expect(err.message).to.equal(`${decodedPath} is missing`);
    });
  });
});
