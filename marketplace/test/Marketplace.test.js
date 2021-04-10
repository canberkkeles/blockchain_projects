const { assert } = require("chai");

require("chai")
  .use(require("chai-as-promised"))
  .should();
const Marketplace = artifacts.require("./Marketplace.sol");

contract("Marketplace", ([deployer, seller, buyer]) => {
  let marketplace;

  before(async () => {
    marketplace = await Marketplace.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await marketplace.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const name = await marketplace.name();
      assert.equal(name, "Tyle Marketplace");
    });
  });

  describe("products", async () => {
    let result, productCount;

    before(async () => {
      result = await marketplace.createProduct(
        "iPhone X",
        web3.utils.toWei("1", "Ether"),
        { from: seller }
      );
      productCount = await marketplace.productCount();
    });

    it("creates products", async () => {
      // SUCCESS
      assert.equal(productCount, 1);
      const event = result.logs[0].args;
      assert.equal(
        event.id.toNumber(),
        productCount.toNumber(),
        "id is correct"
      );
      assert.equal(event.name, "iPhone X", "name is correct");
      assert.equal(event.price, "1000000000000000000", "price is correct");
      assert.equal(event.owner, seller, "owner is correct");
      assert.equal(event.purchased, false, "purchased is correct");

      // FAILURE: Product must have a name
      await marketplace.createProduct("", web3.utils.toWei("1", "Ether"), {
        from: seller,
      }).should.be.rejected;
      await marketplace.createProduct("iPhone X", 0, { from: seller }).should.be
        .rejected;
    });

    it("lists products", async () => {
      const product = await marketplace.products(productCount);
      assert.equal(
        product.id.toNumber(),
        productCount.toNumber(),
        "id is correct"
      );
      assert.equal(product.name, "iPhone X", "name is correct");
      assert.equal(product.price, "1000000000000000000", "price is correct");
      assert.equal(product.owner, seller, "owner is correct");
      assert.equal(product.purchased, false, "purchased is correct");
    });

    it("sells products", async () => {
      // SUCCESS CASES
      let oldBalance = await web3.eth.getBalance(seller);
      oldBalance = new web3.utils.BN(oldBalance);

      result = await marketplace.purchaseProduct(productCount, {
        from: buyer,
        value: web3.utils.toWei("1", "Ether"),
      });

      const event = result.logs[0].args;
      assert.equal(
        event.id.toNumber(),
        productCount.toNumber(),
        "id is correct"
      );
      assert.equal(event.name, "iPhone X", "name is correct");
      assert.equal(event.price, "1000000000000000000", "price is correct");
      assert.equal(event.owner, buyer, "owner is correct");
      assert.equal(event.purchased, true, "purchased is correct");

      let newBalance = await web3.eth.getBalance(seller);
      newBalance = new web3.utils.BN(newBalance);

      let price = web3.utils.toWei("1", "Ether");
      price = new web3.utils.BN(price);

      const expectedBalance = oldBalance.add(price);
      assert.equal(
        newBalance.toString(),
        expectedBalance.toString(),
        " Seller balance is correct"
      );
      // *******************************************

      // FAILURE CASES
      await marketplace.purchaseProduct(99, {
        from: buyer,
        value: web3.utils.toWei("1", "Ether"),
      }).should.be.rejected;

      await marketplace.purchaseProduct(productCount, {
        from: buyer,
        value: web3.utils.toWei("0.5", "Ether"),
      }).should.be.rejected;

      await marketplace.purchaseProduct(productCount, {
        from: deployer,
        value: web3.utils.toWei("1", "Ether"),
      }).should.be.rejected;

      await marketplace.purchaseProduct(productCount, {
        from: buyer,
        value: web3.utils.toWei("1", "Ether"),
      }).should.be.rejected;
    });
  });
});
