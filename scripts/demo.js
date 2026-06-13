async function main() {
  const [manufacturer, supplier, consumer] = await ethers.getSigners();

  const SupplyChain = await ethers.getContractFactory("SupplyChain");
  const supplyChain = await SupplyChain.deploy();
  await supplyChain.waitForDeployment();

  console.log("=== Supply Chain Demo ===\n");
  console.log("Contract:", await supplyChain.getAddress());

  await supplyChain.addParticipant(
    "Acme Manufacturing",
    "demo-pass",
    manufacturer.address,
    "Manufacturer"
  );
  await supplyChain.addParticipant(
    "North Logistics",
    "demo-pass",
    supplier.address,
    "Supplier"
  );
  await supplyChain.addParticipant(
    "Retail Buyer",
    "demo-pass",
    consumer.address,
    "Consumer"
  );

  console.log("\n1) Participants registered");
  console.log("   Manufacturer:", manufacturer.address);
  console.log("   Supplier:    ", supplier.address);
  console.log("   Consumer:    ", consumer.address);

  await supplyChain.addProduct(0, "Widget-X", "WX-100", "SN-001", 250);
  console.log("\n2) Manufacturer created product #0 (Widget-X)");

  await supplyChain.connect(manufacturer).newOwner(0, 1, 0);
  console.log("3) Supplier received product #0");

  await supplyChain.connect(supplier).newOwner(1, 2, 0);
  console.log("4) Consumer received product #0");

  const product = await supplyChain.getProduct(0);
  const provenance = await supplyChain.getProvenance(0);

  console.log("\n5) Final product state");
  console.log("   Model:       ", product[0]);
  console.log("   Serial:      ", product[2]);
  console.log("   Current owner:", product[4]);

  console.log("\n6) Provenance trail (ownership record IDs)");
  console.log("  ", provenance.map((id) => id.toString()).join(" -> "));

  for (const ownershipId of provenance) {
    const record = await supplyChain.getOwnership(ownershipId);
    console.log(
      `   Record #${ownershipId}: participant ${record[1]} now owns product ${record[0]}`
    );
  }

  const authenticated = await supplyChain.authenticateParticipant(
    0,
    "Acme Manufacturing",
    "demo-pass",
    "Manufacturer"
  );
  console.log("\n7) Manufacturer authentication:", authenticated);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
