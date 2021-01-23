import React, { Component } from 'react';
import MyTitle from '../Titles/Title';

class MenuPage extends Component {

  render() {
    return (

      <div class="MenuPage">
        <MyTitle title="תפריט" />
        
        <section id="boxes" class="py-3">
        <p></p> <br/>
        <a href="/Add_User" class="btn btn-outline-dark btn-lg btn-block btn-ctrl-panel">הוספת סטודנט</a>
        <p></p> <br/>
        <a href="/Add_moderator" class="btn btn-outline-dark btn-lg btn-block btn-ctrl-panel">הוספת מנחה</a>
        <p></p> <br/>

          <a href="/Student_Dashboard" class="btn btn-outline-dark btn-lg btn-block btn-ctrl-panel">לוח סטודנטים</a>
        </section>
      </div>

    );
  }
}


export default MenuPage;

