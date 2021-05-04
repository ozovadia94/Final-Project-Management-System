import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyTitle from '../Titles/Title';
import '../CSS/Pages.css' /* CSS */

class MenuPage extends Component {

  render() {
    return (

      <div className="MenuPage backgroundPage">
        <MyTitle title="תפריט" />
        
        <section id="boxes" class="py-3">
        <p></p> <br/>
        <Link to="/Project_Dashboard" class="btn btn-outline-dark btn-lg btn-block btn-ctrl-panel">לוח פרויקטים</Link>
        <p></p> <br/>
        <Link to="/Moderators_Dashboard" class="btn btn-outline-dark btn-lg btn-block btn-ctrl-panel">לוח מנחים</Link>
        <p></p> <br/>
        <Link to="/Add_Project" class="btn btn-outline-dark btn-lg btn-block btn-ctrl-panel">הוספת פרויקט</Link>
        <p></p> <br/>
        <Link to="/Add_moderator" class="btn btn-outline-dark btn-lg btn-block btn-ctrl-panel">הוספת מנחה</Link>
        <p></p> <br/>
        
          
        </section>
      </div>

    );
  }
}


export default MenuPage;

