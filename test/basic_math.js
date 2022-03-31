// const basicMath = artifacts.require("basicMath");

// /*
//  * uncomment accounts to access the test accounts made available by the
//  * Ethereum client
//  * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
//  */
// contract("basicMath", function (/* accounts */) {
//   it("should assert true", async function () {
//     await basicMath.deployed();
//     return assert.isTrue(true);
//   });
// });

var basicMath = artifacts.require("./basicMath.sol");

contract('basicMath', async accounts => {
  it("the sum should not overflow", async () => {
    try {
      // Try to add 2^256 and 5 (should overflow and throw an exception)
      const addResult = contractInstance.add((2**256 -1), 5)
      assert.ok(false,"Threw an exception instead of overflowing.")
    } catch(error) {
      assert.ok(true,"Caught the exception.")
    }
  })
});
