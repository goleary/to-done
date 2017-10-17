import React, { Component } from 'react';
import './App.css';
import firebase, { auth, provider } from './firebase.js';

import MdCheckBox from 'react-icons/lib/md/check-box';
import MdCheckBoxOutlineBlank from 'react-icons/lib/md/check-box-outline-blank';

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
      }
    });
    const itemsRef = firebase.database().ref('items');
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          title: items[item].title,
          user: items[item].user
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
              <button onClick={this.login}>Log In</button>
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
                      return (
                        <li>
                          <h3>{item.productivity}</h3>
                          {item.completed.map(c => {
                            <p>{c}</p>
                          })}
                        </li>
                      )
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
    if (this.state.currentCompleted !== '') {
      this.state.completed = [...this.state.completed, this.state.currentCompleted];
    }
    if (this.state.currentNext !== '') {
      this.state.next = [...this.state.next, this.state.curNext];
    }
    this.setState({
      items: [...this.state.items, {
        date: this.state.date,
        productivity: this.state.productivity,
        completed: this.state.completed,
        next: this.state.next
      }],
      productivity: '',
      currentCompleted: '',
      completed: [],
      currentNext: '',
      next: []
    }
    )
  }
  formatDate(date) {
    return date.toLocaleDateString();
  }
}

export default App;
