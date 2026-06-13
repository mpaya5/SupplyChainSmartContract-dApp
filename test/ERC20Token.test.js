const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC20Token", function () {
  const initialSupply = 10000n;
  let token;
  let deployer;
  let recipient;

  beforeEach(async function () {
    [deployer, recipient] = await ethers.getSigners();
    const ERC20Token = await ethers.getContractFactory("ERC20Token");
    token = await ERC20Token.deploy(
      initialSupply,
      "TotalSem Token",
      18,
      "TotalSem"
    );
  });

  it("mints the full supply to the deployer", async function () {
    expect(await token.balanceOf(deployer.address)).to.equal(initialSupply);
    expect(await token.name()).to.equal("TotalSem Token");
    expect(await token.symbol()).to.equal("TotalSem");
    expect(await token.decimals()).to.equal(18n);
  });

  it("transfers tokens between accounts", async function () {
    const amount = 250n;
    await token.transfer(recipient.address, amount);

    expect(await token.balanceOf(recipient.address)).to.equal(amount);
    expect(await token.balanceOf(deployer.address)).to.equal(
      initialSupply - amount
    );
  });

  it("supports approve and transferFrom", async function () {
    const amount = 100n;
    await token.approve(recipient.address, amount);
    expect(await token.allowance(deployer.address, recipient.address)).to.equal(
      amount
    );

    await token
      .connect(recipient)
      .transferFrom(deployer.address, recipient.address, amount);
    expect(await token.balanceOf(recipient.address)).to.equal(amount);
  });
});
