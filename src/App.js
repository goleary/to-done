import React, { Component } from 'react';
import './App.css';
import firebase, { auth, provider } from './firebase.js';

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
      currrentFeel: '',
      currentCompleted: '',
      currentNext: '',
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
                  <p>Today was <select>
                    {this.productivityOptions.map((item, index) => {
                      return (
                        <option key={index} value={item.value}>{item.text}</option>
                      )
                    })}
                  </select></p>
                  <p>What did you complete today?</p>
                  <textarea name="completed" onChange={this.handleChange} value={this.state.currentCompleted} ></textarea>
                  <p>What's next on the agenda?</p>
                  <textarea name="next" onChange={this.handleChange} value={this.state.currentNext} ></textarea>
                  <button>Save Day</button>
                </form>
              </section>
              <section className='display-item'>
                <div className="wrapper">
                  <ul>
                    {this.state.items.map((item) => {
                      return (
                        <li key={item.id}>
                          <h3>{item.title}</h3>
                          <p>brought by: {item.user}
                            {item.user === this.state.user.displayName || item.user === this.state.user.email ?
                              <button onClick={() => this.removeItem(item.id)}>Remove Item</button> : null}
                          </p>
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
  formatDate(date) {
    return date.toLocaleDateString();
  }
}

export default App;
