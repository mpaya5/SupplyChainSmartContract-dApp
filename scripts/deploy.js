async function main() {
  const [deployer] = await ethers.getSigners();

  const Token = await ethers.getContractFactory("ERC20Token");
  const token = await Token.deploy(
    10000,
    "TotalSem Token",
    18,
    "TotalSem"
  );
  await token.waitForDeployment();

  const SupplyChain = await ethers.getContractFactory("SupplyChain");
  const supplyChain = await SupplyChain.deploy();
  await supplyChain.waitForDeployment();

  console.log("Deployer:", deployer.address);
  console.log("ERC20Token:", await token.getAddress());
  console.log("SupplyChain:", await supplyChain.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
