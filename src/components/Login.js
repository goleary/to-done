import React, { Component } from 'react';
import firebase, { auth, facebook, google } from '../firebase.js';

import './Login.css';

class Login extends Component {
  providers = {
    facebook,
    google
  }
  constructor() {
    super();
    this.state = {
      user: null
    };
  }

  render() {
    return (
      <div className="LoginComponent">
        {this.state.user ?
          <div className='user-profile'>
            <img src={this.state.user.photoURL} />
          </div>
          :
          <div>
            <button class="google" onClick={() => this.login('google')}>Log In with Google</button>
            <button class="facebook" onClick={() => this.login('facebook')}>Log In with Facebook</button>
          </div>
        }
      </div>
    );
  }
  login = (provider) => {
    auth.signInWithPopup(this.providers[provider])
      .then((result) => {
        const user = result.user;
        this.setState({
          user
        });
      });
  }
}

export default Login;