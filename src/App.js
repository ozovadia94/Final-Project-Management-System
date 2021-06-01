import React, { Component } from 'react';
import { Route, Switch, Redirect, Link } from "react-router-dom";
import './App.css';

//pages
import MenuPage from './JS/MenuPage'
import Add_moderator from './JS/Add_moderator'
import Moderators_Dashboard from './JS/Moderators_Dashboard'
import Add_Project from './JS/Add_Project'
import Project_Dashboard from './JS/Project_Dashboard'

import Students from './JS/Students'
import NotFoundPage from './JS/NotFoundPage'

//More Components
import Login from './JS/Login'
import firebase from './Firebase/Firebase';
import axios from 'axios';

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
    console.log('WTF!')
    axios.get('http://localhost:3000/wtf').then((res)=>{
      console.log(res)
      console.log('xxx')
    }).catch(err=>{
      console.log('IMMMM')
      console.log('ERRORRRR!!','\n',err)
    })
    

    document.onreadystatechange = function () {
      var after = document.querySelector(".after_loading")
      var loader = document.querySelector(".loader")

      if (document.readyState !== "complete") {
        if (after !== null)
          if (after.style !== null)
            after.style.visibility = "hidden";
        if (loader !== null)
          if (loader.style !== null)
            loader.style.visibility = "visible";
      }
      else {
        if (loader !== null)
          if (loader.style !== null)
            loader.style.visibility = "none";
        if (after !== null)
          if (after.style !== null)
            after.style.visibility = "visible";
      }
    };
    this.checkAuth()
    //console.clear()
    
  }

  checkAuth() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {

        this.setState({ login: 'true' });
      }
    })
  }

  logout() {
    firebase.auth().signOut();
    alert("התנתקת!")
    this.setState({ login: null });
    window.location.reload();
  }


  render() {


    return (
      <div className="App">


        <div class="after_loading">
          {this.state.login ? (
            <div>

              <nav class="navbar navbar-dark bg-dark" dir="rtl">
                <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups" >
                  <Link to="/MenuPage" type="submit" class="btn btn-dark">תפריט</Link>
                  <Link to="/Project_Dashboard" type="submit" class="btn btn-dark">לוח פרוייקטים</Link>
                  <Link to="/Moderators_Dashboard" type="submit" class="btn btn-dark">לוח מנחים</Link>
                  <Link to="/Add_moderator" type="submit" class="btn btn-dark">הוספת מנחה</Link>
                  <Link to="/Add_Project" type="submit" class="btn btn-dark">הוספת פרוייקט</Link>
                  <button type="submit" class="btn btn-dark" onClick={this.logout}>התנתק</button>
                </div>
              </nav>

              <Switch>
                <Route path="/MenuPage" component={MenuPage} exact />
                <Route path="/Add_moderator" component={Add_moderator} />
                <Route path="/Moderators_Dashboard" component={Moderators_Dashboard} />
                <Route path="/Add_Project" component={Add_Project} />
                <Route path="/Project_Dashboard" component={Project_Dashboard} />

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


    );
  }
}


const Home = () => <div><h2>Home</h2></div>
const About = () => <div><h2>About</h2></div>

export default App;