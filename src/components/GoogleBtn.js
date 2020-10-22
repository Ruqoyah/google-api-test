import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';


const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

class GoogleBtn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false
    };

    this.login = this.login.bind(this);
  }

  login(response) {
    if (response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken)
      this.setState(state => ({
        isLoggedIn: true
      }));
    }
  }

  render() {
    return this.state.isLoggedIn ? <Redirect to="/calendar" /> : (
      <div className="wrap">
          <GoogleLogin
            className="button"
            clientId={CLIENT_ID}
            buttonText='Login'
            onSuccess={this.login}
            cookiePolicy={'single_host_origin'}
            responseType='code,token'
            scope="https://www.googleapis.com/auth/calendar.readonly"
          />
      </div>
    )
  }
}

export default GoogleBtn;