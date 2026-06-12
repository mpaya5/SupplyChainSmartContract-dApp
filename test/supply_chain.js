const SupplyChain = artifacts.require("./SupplyChain.sol");

contract("SupplyChain", (accounts) => {
  let instance;
  const [manufacturerA, manufacturerB, supplierD, supplierE, consumerF, consumerG] = accounts;

  before(async () => {
    instance = await SupplyChain.new();
  });

  it("registers Manufacturer, Supplier, and Consumer participants", async () => {
    await instance.addParticipant("A", "passA", manufacturerA, "Manufacturer");
    await instance.addParticipant("B", "passB", manufacturerB, "Manufacturer");
    await instance.addParticipant("D", "passD", supplierD, "Supplier");
    await instance.addParticipant("E", "passE", supplierE, "Supplier");
    await instance.addParticipant("F", "passF", consumerF, "Consumer");
    await instance.addParticipant("G", "passG", consumerG, "Consumer");

    const participantA = await instance.participants(0);
    const participantD = await instance.participants(2);
    const participantF = await instance.participants(4);

    assert.equal(participantA[0], "A");
    assert.equal(participantA[2], "Manufacturer");
    assert.equal(participantD[2], "Supplier");
    assert.equal(participantF[2], "Consumer");
  });

  it("returns participant details via getParticipant", async () => {
    const details = await instance.getParticipant(0);
    assert.equal(details[0], "A");
    assert.equal(details[1], manufacturerA);
    assert.equal(details[2], "Manufacturer");
  });

  it("authenticates participants with correct credentials", async () => {
    const valid = await instance.authenticateParticipant(0, "A", "passA", "Manufacturer");
    const invalid = await instance.authenticateParticipant(0, "A", "wrong", "Manufacturer");

    assert.isTrue(valid);
    assert.isFalse(invalid);
  });

  it("allows manufacturers to register products", async () => {
    await instance.addProduct(0, "ABC", "100", "123", 11);
    const productCount = await instance.product_id();
    const product = await instance.getProduct(0);

    assert.equal(productCount.toNumber(), 1);
    assert.equal(product[0], "ABC");
    assert.equal(product[1], "100");
    assert.equal(product[2], "123");
    assert.equal(product[3].toNumber(), 11);
    assert.equal(product[4], manufacturerA);
  });

  it("rejects product creation from non-manufacturer participants", async () => {
    const beforeCount = await instance.product_id();
    await instance.addProduct(2, "XYZ", "999", "000", 50);
    const afterCount = await instance.product_id();
    assert.equal(afterCount.toNumber(), beforeCount.toNumber());
  });

  it("transfers ownership along the supply chain", async () => {
    await instance.newOwner(0, 2, 0, { from: manufacturerA });
    const product = await instance.getProduct(0);

    assert.equal(product[4], supplierD);
  });

  it("records ownership history and provenance", async () => {
    await instance.newOwner(2, 3, 0, { from: supplierD });
    await instance.newOwner(3, 4, 0, { from: supplierE });

    const provenance = await instance.getProvenance(0);
    assert.isAtLeast(provenance.length, 2);

    const ownershipRecord = await instance.getOwnership(provenance[0]);
    assert.equal(ownershipRecord[0].toNumber(), 0);
    assert.equal(ownershipRecord[1].toNumber(), 2);
    assert.equal(ownershipRecord[2], supplierD);
  });
});
