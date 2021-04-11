import React, { Component } from "react";

class Main extends Component {
  render() {
    return (
      <div id="content">
        <h1>Create Task</h1>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const name = this.taskName.value;
            this.props.createTask(name);
          }}
        >
          <div className="form-group mr-sm-2">
            <input
              id="taskName"
              type="text"
              ref={(input) => {
                this.taskName = input;
              }}
              className="form-control"
              placeholder="Task Name"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Create Task
          </button>
        </form>
        <p>&nbsp;</p>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Complete</th>
            </tr>
          </thead>
          <tbody id="tasksList">
            {this.props.tasks.map((task, key) => {
              return (
                <tr key={key}>
                  <th scope="row">{task.id.toString()}</th>
                  <td>{task.content}</td>
                  <td>{task.completed.toString()}</td>
                  <td>
                    {!task.completed ? (
                      <button
                        name={task.id}
                        className="completeButton"
                        onClick={(event) => {
                          this.props.completeTask(event.target.name);
                        }}
                      >
                        Complete
                      </button>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;
