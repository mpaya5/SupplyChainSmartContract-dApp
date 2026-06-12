const ERC20Token = artifacts.require("./erc20Token.sol");

contract("ERC20Token", (accounts) => {
  const [deployer, recipient] = accounts;
  const initialSupply = 10000;
  let token;

  before(async () => {
    token = await ERC20Token.new(initialSupply, "TotalSem Token", 18, "TotalSem");
  });

  it("mints the full supply to the deployer", async () => {
    const balance = await token.balanceOf(deployer);

    assert.equal(balance.toNumber(), initialSupply);
    assert.equal(await token.name(), "TotalSem Token");
    assert.equal(await token.symbol(), "TotalSem");
    assert.equal((await token.decimals()).toNumber(), 18);
  });

  it("transfers tokens between accounts", async () => {
    const amount = 250;

    await token.transfer(recipient, amount, { from: deployer });

    const recipientBalance = await token.balanceOf(recipient);
    const deployerBalance = await token.balanceOf(deployer);

    assert.equal(recipientBalance.toNumber(), amount);
    assert.equal(deployerBalance.toNumber(), initialSupply - amount);
  });

  it("supports approve and transferFrom", async () => {
    const amount = 100;

    await token.approve(recipient, amount, { from: deployer });
    const allowance = await token.allowance(deployer, recipient);
    assert.equal(allowance.toNumber(), amount);

    await token.transferFrom(deployer, recipient, amount, { from: recipient });
    assert.equal((await token.balanceOf(recipient)).toNumber(), 350);
  });
});
