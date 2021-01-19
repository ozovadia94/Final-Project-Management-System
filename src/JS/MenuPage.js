import React, { Component } from 'react';
import MyTitle from '../Titles/Title';


class MenuPage extends Component {

  render() {
    return (

      <div class="MenuPage">
        <MyTitle title="לוח בקרה למשתמש" />
        
        <section id="boxes" class="py-3">
        <p></p> <br/>
          <a href="/Add_User" class="btn btn-outline-dark btn-lg btn-block btn-ctrl-panel">הוספת סטודנט</a>
          <p></p>
          <a href="/Student_Dashboard" class="btn btn-outline-dark btn-lg btn-block btn-ctrl-panel">לוח סטודנטים</a>
        </section>
      </div>

    );
  }
}


export default MenuPage;

