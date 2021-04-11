import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import TodoList from "../abis/TodoList.json";
import Navbar from "./Navbar";
import Main from "./Main";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable;
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.requestAccounts();
    this.setState({ account: accounts[0] });
    const networkId = await web3.eth.net.getId();
    const networkData = TodoList.networks[networkId];
    if (networkData) {
      const todolist = web3.eth.Contract(TodoList.abi, networkData.address);
      this.setState({ todolist });
      const taskCount = await todolist.methods.taskCount().call();
      this.setState({ taskCount });

      for (var i = 1; i <= taskCount; i++) {
        const task = await todolist.methods.tasks(i).call();
        this.setState({
          tasks: [...this.state.tasks, task],
        });
      }
      this.setState({ loading: false });
    } else {
      window.alert("TodoList contract not deployed to detected network!");
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account: "account",
      taskCount: 0,
      tasks: [],
      loading: true,
    };

    this.createTask = this.createTask.bind(this);
    this.completeTask = this.completeTask.bind(this);
  }

  async createTask(name) {
    this.setState({ loading: true });
    await this.state.todolist.methods
      .createTask(name)
      .send({ from: this.state.account });
    this.setState({ loading: false });
  }

  completeTask(id) {
    this.setState({ loading: true });
    this.state.todolist.methods
      .completeTask(id)
      .send({ from: this.state.account })
      .once("receipt", (receipt) => {
        this.setState({ loading: false });
      });
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              {this.state.loading ? (
                <div id="loader" className="text-center">
                  <p className="text-center">Loading...</p>
                </div>
              ) : (
                <Main
                  tasks={this.state.tasks}
                  createTask={this.createTask}
                  completeTask={this.completeTask}
                />
              )}
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
