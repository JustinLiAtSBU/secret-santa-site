import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Redirect, NavLink } from 'react-router-dom';
import { Button, Icon, Dropdown, Switch, Modal, SideNav, SideNavItem } from 'react-materialize';
import { loginHandler } from '../../store/database/asynchHandler'

class LoginScreen extends Component {
  state = {
    email: '',
    password: '',
  }

  handleChange = (e) => {
    const { target } = e;

    this.setState(state => ({
      ...state,
      [target.id]: target.value,
    }));
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { props, state } = this;
    const { firebase } = props;
    const credentials = { ...state };
    const authData = {
      firebase,
      credentials,
    };

    props.login(authData);
  }

  render() {
    const { auth, authError } = this.props;
    if (auth.uid) {
      return <Redirect to="/" />;
    }

    return (
      <div style={{ borderColor: "grey", borderWidth: "thin", borderRadius: "25px", borderStyle: "solid" }}>
        <div>
          <form onSubmit={this.handleSubmit} className="col s4 white">
            <h5 className="grey-text text-darken-3">Login</h5>
            <div className="input-field">
              <label htmlFor="email">Email</label>
              <input className="active" type="email" name="email" id="email" onChange={this.handleChange} />
            </div>
            <div className="input-field">
              <label htmlFor="password">Password</label>
              <input className="active" type="password" name="password" id="password" onChange={this.handleChange} />
            </div>
            <div className="input-field">
            <Button node="button" type="submit" waves="light">Login</Button>    
            <NavLink to="/register">  
              <Button flat node="button" waves="light">Register</Button>
            </NavLink>
            {authError ? <div className="red-text center"><p>{authError}</p></div> : null}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authError: state.auth.authError,
  auth: state.firebase.auth,
});

const mapDispatchToProps = dispatch => ({
  login: authData => dispatch(loginHandler(authData)),
});

// We need firebaseConnect function to provide to this component
// firebase object with auth method.
// You can find more information on the link below
// http://docs.react-redux-firebase.com/history/v3.0.0/docs/auth.html
export default compose(
  firebaseConnect(),
  connect(mapStateToProps, mapDispatchToProps),
)(LoginScreen);