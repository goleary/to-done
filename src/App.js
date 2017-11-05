import React, { Component } from 'react';
import './App.css';
import firebase, { auth, provider } from './firebase.js';

import MdCheckBox from 'react-icons/lib/md/check-box';
import MdCheckBoxOutlineBlank from 'react-icons/lib/md/check-box-outline-blank';

import Item from './components/Item';
import Login from './components/Login';

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
      <div className="App">
        <header>
          <div className="wrapper">
            <h1>To Done!</h1>
            {this.state.user ?
              <button onClick={this.logout}>Logout {this.state.user.displayName || this.state.user.email}</button>
              :
              <Login />
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
                <div className="wrapper">
                  <ul>
                    {this.state.items.map((item) => {
                      return (<Item item={item} deleteMe={(id)=>this.handleItemDelete(id)} />)
                    })}
                  </ul>
                </div>
              </section>
            </div>
          </div>
          :
          <div className='wrapper'>
            <p>You must be logged in to see your items.</p>
          </div>
        }
      </div>
    );
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
        this.setState({
          completed: [...this.state.completed, e.target.value],
          currentCompleted: ''
        });
      }
      else if (e.target.name === 'currentNext') {
        this.setState({
          next: [...this.state.next, e.target.value],
          currentNext: ''
        });
      }
      console.log('Enter pressed: ', e.target);
    }
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
  handleItemDelete(itemId){
    let itemRef = this.itemsRef.child(itemId);
    itemRef.remove();
  }
  formatDate(date) {
    return date.toLocaleDateString();
  }
}

export default App;
