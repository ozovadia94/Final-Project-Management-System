import React, { Component } from 'react';
import firebase from './Firebase/Firebase';
import Add_User from './User/Add_User'
import Login from './Login/login'
import './App.css';

/*

import { Redirect } from 'react-router-dom'
import { BrowserRouter, Route, Switch } from "react-router-dom";

*/






document.onreadystatechange = function () {
  if (document.readyState !== "complete") {
    document.querySelector(".after_loading").style.visibility = "hidden";
    document.querySelector(".loader").style.visibility = "visible";
  } else {
    document.querySelector(".loader").style.display = "none";
    document.querySelector(".after_loading").style.visibility = "visible";
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      login: null,
    }
    this.logout = this.logout.bind(this);
    this.checkRole = this.checkAuth.bind(this);
    this.ozclick = this.ozclick.bind(this);
  }

  componentDidMount() {
    this.checkAuth()
  }

  checkAuth() {
    firebase.auth().onAuthStateChanged((user) => {
      console.log(user);
      if (user) {

        this.setState({ login: 'yes' });
      }
    })
  }

  logout() {
    firebase.auth().signOut();
    alert("התנתקת!")
    window.location.reload();
  }

  ozclick() {
    
  }

  render() {
    return (
      <div className="App">

        <div class="loader"></div>

        <div class="after_loading">
          {this.state.login ? (
            <div>
              <button id="but_login" type="submit" class="btn btn-black" onClick={this.logout}>Disconnect</button>
              <button id="but_login" type="submit" class="btn btn-black" onClick={this.ozclick}>עמוד</button>
              <Add_User/>
      
            </div>
            
            

          ) : (<div> <Login /> </div>)}
        </div>



      </div>
    );
  }
}


export default App;
