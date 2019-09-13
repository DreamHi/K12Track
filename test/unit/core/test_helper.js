const should  = require("should");
const helper  = require("../../../src/core/helper");

describe("src/core/helper.js", () => {
  describe("randomWord()", () => {
    // it("should return word.", () => {
    //   const result = helper.randomWord("How are you", 20);
    //   console.log(result);
    //   should.exist(result);
    // });
  });

  describe("random()", () => {
    it("should return random.", () => {
      const result = helper.random(20);
      console.log(result);
      should.exist(result);
    });
  });
});
