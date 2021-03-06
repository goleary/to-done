import React, { Component } from 'react';
import './App.css';
import firebase, { auth, provider } from './firebase.js';

import _ from 'lodash';

import MdCheckBox from 'react-icons/lib/md/check-box';
import MdCheckBoxOutlineBlank from 'react-icons/lib/md/check-box-outline-blank';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

import Incomplete from './components/Incomplete';
import Item from './components/Item';

class App extends Component {

  productivityOptions = [
    {
      text: '',
      value: ''
    },
    {
      text: 'Not Productive',
      value: 'notProductive'
    },
    {
      text: 'Semi Productive',
      value: 'semiProductive'
    },
    {
      text: 'Productive',
      value: 'productive'
    },
    {
      text: 'Super Productive',
      value: 'superProductive'
    }

  ];
  itemsRef = null;
  constructor() {
    super();
    this.state = {
      date: new Date(),
      user: null,
      productivity: '',
      curNext: '',
      currentCompleted: '',
      completed: [],
      next: [],
      items: []
    }
  }
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
        this.connectDB();
      }
    });

  }

  connectDB() {
    var userId = firebase.auth().currentUser.uid;
    this.itemsRef = firebase.database().ref('/users/' + userId + '/items');
    this.itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let id in items) {
        newState.push({
          id: id,
          completed: items[id].completed,
          next: items[id].next,
          productivity: items[id].productivity,
          date: items[id].date
        });
      }
      this.setState({
        items: newState
      });
    });
  }
  render() {
    return (
      <MuiThemeProvider>

        <div className="App">
          <header>
            <div className="wrapper">
              <h1>To Done!</h1>
              {this.state.user ?
                <RaisedButton onClick={this.logout} label={'Logout ' + this.state.user.displayName || this.state.user.email}> </RaisedButton>
                :
                <RaisedButton onClick={this.login} label="Login"></RaisedButton>
              }
            </div>
          </header>
          {this.state.user ?
            <div>
              <div className='user-profile'>
                <img src={this.state.user.photoURL} />
              </div>
              <div className='container'>
                <section className='add-item'>
                  <h1>Tell me about today</h1>
                  <p>{this.formatDate(this.state.date)}</p>
                  <form onSubmit={this.handleSubmit}>
                    <p>Today was <select name='productivity' value={this.state.productivity} onChange={this.handleChange}>
                      {this.productivityOptions.map((item, index) => {
                        return (
                          <option key={index} value={item.value}>{item.text}</option>
                        )
                      })}
                    </select></p>
                    <p>What did you complete today?</p>
                    {this.state.completed.map((item, index) => {
                      return (
                        <p><MdCheckBox /> {this.state.completed[index]}</p>

                      )
                    })}
                    <p><MdCheckBox /><input type="text" name='currentCompleted' onChange={this.handleChange} value={this.state.currentCompleted} onKeyPress={this._handleKeyPress}></input></p>


                    <p>What's next on the agenda?</p>
                    {this.state.next.map((item, index) => {
                      return (
                        <p><MdCheckBoxOutlineBlank /> {this.state.next[index]}</p>

                      )
                    })}
                    <p><MdCheckBoxOutlineBlank /><input type="text" name='currentNext' onChange={this.handleChange} value={this.state.currentNext} onKeyPress={this._handleKeyPress}></input></p>
                    <button>Save Day</button>
                  </form>
                </section>
                <section className='display-item'>
                  <Incomplete tasks={this.incompleteTasks} completeTask={(task) => this.addCompletedTask(task)} />
                  {this.state.items.map((item) => {
                    return (<Item item={item} deleteMe={(id) => this.handleItemDelete(id)} />)
                  })}
                </section>
              </div>
            </div>
            :
            <div className='wrapper'>
              <p>You must be logged in to see your items.</p>
            </div>
          }
        </div>
      </MuiThemeProvider>
    );
  }
  login = () => {
    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        this.setState({
          user
        });
      });
  }
  logout = () => {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
  }
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  _handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.target.name === 'currentCompleted') {
        this.addCompletedTask(e.target.value);
        this.setState({
          currentCompleted: ''
        });
      }
      else if (e.target.name === 'currentNext') {
        this.addIncompleteTask(e.target.value);
        this.setState({
          curNext: ''
        });
      }
      console.log('Enter pressed: ', e.target);
    }
  }
  addIncompleteTask(task) {
    this.setState({
      next: [...this.state.next, task]
    });
  }
  addCompletedTask(task) {
    this.setState({
      completed: [...this.state.completed, task]
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    let completed = this.state.completed,
      next = this.state.next;
    if (this.state.currentCompleted !== '') {
      completed = [...completed, this.state.currentCompleted];
    }
    if (this.state.currentNext !== '') {
      next = [...next, this.state.curNext];
    }
    let item = {
      date: this.state.date.toDateString(),
      productivity: this.state.productivity,
      completed: completed,
      next: next
    };
    this.addItem(item);
    this.setState({
      productivity: '',
      currentCompleted: '',
      completed: [],
      currentNext: '',
      next: []
    }
    )
  }
  addItem(item) {
    this.itemsRef.push(item);
  }
  handleItemDelete(itemId) {
    let itemRef = this.itemsRef.child(itemId);
    itemRef.remove();
  }
  formatDate(date) {
    return date.toLocaleDateString();
  }

  get incompleteTasks() {
    return _.flatten(_.map(this.state.items, item => item.next));
  }
}

export default App;
