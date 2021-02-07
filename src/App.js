import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import './App.css';

//pages
import MenuPage from './JS/MenuPage'
import Add_User from './JS/Add_User'
import Student_Dashboard from './JS/Student_Dashboard'
import Add_moderator from './JS/Add_moderator'
import Moderators_Dashboard from './JS/Moderators_Dashboard'
import Students from './JS/Students'
import NotFoundPage from './JS/NotFoundPage'

//More Components
import Login from './JS/Login'
import firebase from './Firebase/Firebase';

class App extends Component {
  constructor() {
    super();
    this.logout = this.logout.bind(this);
    this.checkRole = this.checkAuth.bind(this);
  }
  state = {
    login: null,
  }

  componentDidMount() {
    document.onreadystatechange = function () {
      if (document.readyState !== "complete") {
        document.querySelector(".after_loading").style.visibility = "hidden";
        document.querySelector(".loader").style.visibility = "visible";
      } else {
        document.querySelector(".loader").style.display = "none";
        document.querySelector(".after_loading").style.visibility = "visible";
      }
    };
    this.checkAuth()
    console.clear()
  }

  checkAuth() {
    firebase.auth().onAuthStateChanged((user) => {
      console.log('Connected');
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


  render() {
    return (
      <BrowserRouter>
        <div className="App">



          <div class="after_loading">
            {this.state.login ? (
              <div>

                <nav class="navbar navbar-dark bg-dark" dir="rtl">
                  <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups" >
                    <a href="/MenuPage" type="submit" class="btn btn-dark">תפריט</a>
                    <a href="/Student_Dashboard" type="submit" class="btn btn-dark">לוח סטודנטים</a>
                    <a href="/Moderators_Dashboard" type="submit" class="btn btn-dark">לוח מנחים</a>
                    <a href="/Add_User" type="submit" class="btn btn-dark">הוספת סטודנט</a>
                    <a href="/Add_moderator" type="submit" class="btn btn-dark">הוספת מנחה</a>
                    <button type="submit" class="btn btn-dark" onClick={this.logout}>התנתק</button>
                  </div>
                </nav>

                <Switch>
                  <Route path="/MenuPage" component={MenuPage} />
                  <Route path="/Add_User" component={Add_User} />
                  <Route path="/Student_Dashboard" component={Student_Dashboard} />
                  <Route path="/Add_moderator" component={Add_moderator} />
                  <Route path="/Moderators_Dashboard" component={Moderators_Dashboard} />


                  <Route path="/Students" component={Students} />
                  <Route exact path="/"><Redirect to="/MenuPage" /></Route>
                  <Route path="/404" component={NotFoundPage} />
                  <Redirect to="/404" />
                </Switch>
              </div>





            ) : (<div>
              <Switch>
                <Route path="/" component={Login} />
              </Switch>


              <div class="loader"></div>




            </div>)}
          </div>



        </div>
      </BrowserRouter>
    );
  }
}


export default App;
