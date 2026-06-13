const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("End-to-end supply chain flow", function () {
  it("manufacturer creates product, supplier and consumer receive it, provenance is queried", async function () {
    const [manufacturer, supplier, consumer] = await ethers.getSigners();
    const SupplyChain = await ethers.getContractFactory("SupplyChain");
    const supplyChain = await SupplyChain.deploy();

    await supplyChain.addParticipant(
      "Acme",
      "secret",
      manufacturer.address,
      "Manufacturer"
    );
    await supplyChain.addParticipant(
      "LogisticsCo",
      "secret",
      supplier.address,
      "Supplier"
    );
    await supplyChain.addParticipant(
      "RetailCo",
      "secret",
      consumer.address,
      "Consumer"
    );

    await supplyChain.addProduct(0, "Widget-X", "WX-100", "SN-001", 250);

    const createdProduct = await supplyChain.getProduct(0);
    expect(createdProduct[0]).to.equal("Widget-X");
    expect(createdProduct[4]).to.equal(manufacturer.address);

    await supplyChain.connect(manufacturer).newOwner(0, 1, 0);
    const afterSupplier = await supplyChain.getProduct(0);
    expect(afterSupplier[4]).to.equal(supplier.address);

    await supplyChain.connect(supplier).newOwner(1, 2, 0);
    const afterConsumer = await supplyChain.getProduct(0);
    expect(afterConsumer[4]).to.equal(consumer.address);

    const provenance = await supplyChain.getProvenance(0);
    expect(provenance.length).to.equal(2);

    const firstTransfer = await supplyChain.getOwnership(provenance[0]);
    const secondTransfer = await supplyChain.getOwnership(provenance[1]);

    expect(firstTransfer[1]).to.equal(1n);
    expect(firstTransfer[2]).to.equal(supplier.address);
    expect(secondTransfer[1]).to.equal(2n);
    expect(secondTransfer[2]).to.equal(consumer.address);
  });
});
