const basicMath = artifacts.require("./basicMath.sol");

contract("basicMath", () => {
  it("adds two numbers correctly", async () => {
    const instance = await basicMath.new();
    const result = await instance.add(3, 5);

    assert.equal(result.toNumber(), 8);
  });
});
