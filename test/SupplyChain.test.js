const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SupplyChain", function () {
  let supplyChain;
  let manufacturer;
  let manufacturerB;
  let supplier;
  let supplierB;
  let consumer;

  beforeEach(async function () {
    [manufacturer, manufacturerB, supplier, supplierB, consumer] =
      await ethers.getSigners();
    const SupplyChain = await ethers.getContractFactory("SupplyChain");
    supplyChain = await SupplyChain.deploy();
  });

  it("registers Manufacturer, Supplier, and Consumer participants", async function () {
    await supplyChain.addParticipant(
      "A",
      "passA",
      manufacturer.address,
      "Manufacturer"
    );
    await supplyChain.addParticipant(
      "B",
      "passB",
      manufacturerB.address,
      "Manufacturer"
    );
    await supplyChain.addParticipant("D", "passD", supplier.address, "Supplier");
    await supplyChain.addParticipant(
      "E",
      "passE",
      supplierB.address,
      "Supplier"
    );
    await supplyChain.addParticipant("F", "passF", consumer.address, "Consumer");

    const participantA = await supplyChain.participants(0);
    const participantD = await supplyChain.participants(2);
    const participantF = await supplyChain.participants(4);

    expect(participantA.userName).to.equal("A");
    expect(participantA.participantType).to.equal("Manufacturer");
    expect(participantD.participantType).to.equal("Supplier");
    expect(participantF.participantType).to.equal("Consumer");
  });

  it("returns participant details via getParticipant", async function () {
    await supplyChain.addParticipant(
      "A",
      "passA",
      manufacturer.address,
      "Manufacturer"
    );

    const [name, address, type] = await supplyChain.getParticipant(0);
    expect(name).to.equal("A");
    expect(address).to.equal(manufacturer.address);
    expect(type).to.equal("Manufacturer");
  });

  it("authenticates participants with correct credentials", async function () {
    await supplyChain.addParticipant(
      "A",
      "passA",
      manufacturer.address,
      "Manufacturer"
    );

    expect(
      await supplyChain.authenticateParticipant(0, "A", "passA", "Manufacturer")
    ).to.equal(true);
    expect(
      await supplyChain.authenticateParticipant(0, "A", "wrong", "Manufacturer")
    ).to.equal(false);
  });

  it("allows manufacturers to register products", async function () {
    await supplyChain.addParticipant(
      "A",
      "passA",
      manufacturer.address,
      "Manufacturer"
    );

    await supplyChain.addProduct(0, "ABC", "100", "123", 11);
    const productCount = await supplyChain.productIdCounter();
    const product = await supplyChain.getProduct(0);

    expect(productCount).to.equal(1n);
    expect(product[0]).to.equal("ABC");
    expect(product[1]).to.equal("100");
    expect(product[2]).to.equal("123");
    expect(product[3]).to.equal(11n);
    expect(product[4]).to.equal(manufacturer.address);
  });

  it("rejects product creation from non-manufacturer participants", async function () {
    await supplyChain.addParticipant(
      "A",
      "passA",
      manufacturer.address,
      "Manufacturer"
    );
    await supplyChain.addParticipant("D", "passD", supplier.address, "Supplier");

    await supplyChain.addProduct(0, "ABC", "100", "123", 11);
    const beforeCount = await supplyChain.productIdCounter();
    await supplyChain.addProduct(1, "XYZ", "999", "000", 50);
    const afterCount = await supplyChain.productIdCounter();

    expect(afterCount).to.equal(beforeCount);
  });

  it("transfers ownership along the supply chain", async function () {
    await supplyChain.addParticipant(
      "A",
      "passA",
      manufacturer.address,
      "Manufacturer"
    );
    await supplyChain.addParticipant("D", "passD", supplier.address, "Supplier");
    await supplyChain.addProduct(0, "ABC", "100", "123", 11);

    await supplyChain.connect(manufacturer).newOwner(0, 1, 0);
    const product = await supplyChain.getProduct(0);

    expect(product[4]).to.equal(supplier.address);
  });

  it("records ownership history and provenance", async function () {
    await supplyChain.addParticipant(
      "A",
      "passA",
      manufacturer.address,
      "Manufacturer"
    );
    await supplyChain.addParticipant("D", "passD", supplier.address, "Supplier");
    await supplyChain.addParticipant(
      "E",
      "passE",
      supplierB.address,
      "Supplier"
    );
    await supplyChain.addParticipant("F", "passF", consumer.address, "Consumer");
    await supplyChain.addProduct(0, "ABC", "100", "123", 11);

    await supplyChain.connect(manufacturer).newOwner(0, 1, 0);
    await supplyChain.connect(supplier).newOwner(1, 2, 0);
    await supplyChain.connect(supplierB).newOwner(2, 3, 0);

    const provenance = await supplyChain.getProvenance(0);
    expect(provenance.length).to.be.at.least(2);

    const ownershipRecord = await supplyChain.getOwnership(provenance[0]);
    expect(ownershipRecord[0]).to.equal(0n);
    expect(ownershipRecord[1]).to.equal(1n);
    expect(ownershipRecord[2]).to.equal(supplier.address);
  });
});
