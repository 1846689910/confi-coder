const config = require("../src/config");
const { expect } = require("chai");
const sinon = require("sinon");
describe("coder", () => {
  describe("function resolveKey", () => {
    let fakeConfig;
    afterEach(() => {
      if (fakeConfig) {
        fakeConfig.restore();
        fakeConfig = null;
      }
    });
    it("should use config.KEY if no CODER_KEY given", () => {
      fakeConfig = sinon.stub(config, "KEY").value("key");
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
  });
});
