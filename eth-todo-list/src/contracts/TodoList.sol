pragma solidity ^0.5.0;

contract TodoList {
    uint256 public taskCount = 0;

    struct Task {
        uint256 id;
        string content;
        bool completed;
    }

    event TaskCreated(uint256 id, string content, bool completed);
    event TaskCompleted(uint256 id, string content, bool completed);

    constructor() public {
        createTask("CS 48001 Project Studies");
    }

    mapping(uint256 => Task) public tasks;

    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);
        emit TaskCreated(taskCount, _content, false);
    }

    function completeTask(uint256 _id) public {
        require(_id <= taskCount);
        Task memory task = tasks[_id];
        require(task.completed == false);
        task.completed = true;
        tasks[_id] = task;
        emit TaskCompleted(_id, task.content, task.completed);
    }
}
