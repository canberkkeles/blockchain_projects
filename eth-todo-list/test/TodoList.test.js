const { assert } = require("chai");
require("chai").use(require("chai-as-promised")).should();

const TodoList = artifacts.require("./TodoList.sol");
contract("TodoList", (accounts) => {
  let todoList;
  before(async () => {
    todoList = await TodoList.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await todoList.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });
    it("creates initial task", async () => {
      const taskCount = await todoList.taskCount();
      assert.equal(1, taskCount);
      const task = await todoList.tasks(taskCount);
      assert.equal(task.content, "CS 48001 Project Studies", "Name is correct");
      assert.equal(task.id.toNumber(), taskCount.toNumber(), "ID is correct");
      assert.equal(task.completed, false, "Completion is correct");
    });
  });

  describe("task functionality", async () => {
    it("creates tasks", async () => {
      let result = await todoList.createTask("Creation of task");
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), 2, "ID is correct");
      assert.equal(event.content, "Creation of task", "Name is correct");
      assert.equal(event.completed, false, "Completion is correct");
    });

    it("completes tasks", async () => {
      // SUCCESS CASE
      let result = await todoList.completeTask(2);
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), 2, "ID is correct");
      assert.equal(event.content, "Creation of task", "Name is correct");
      assert.equal(event.completed, true, "Completion is correct");

      // FAILURE CASE
      await todoList.completeTask(2).should.be.rejected;
      await todoList.completeTask(99).should.be.rejected;
    });
  });
});
