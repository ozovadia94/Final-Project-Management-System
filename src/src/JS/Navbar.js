import React from 'react';

const mynavbar = (props) => (

      <nav class="navbar navbar-dark bg-dark" dir="rtl">
                  <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups" >                      
                      <a href="/MenuPage" type="submit" class="btn btn-dark">תפריט</a>
                      <a href="/Student_Dashboard" type="submit" class="btn btn-dark">לוח סטודנטים</a>
                      <a href="/Add_User" type="submit" class="btn btn-dark">הוספת סטודנט</a>
                      <button type="submit" class="btn btn-dark" onClick={this.logout}>התנתק</button>
                  </div>
                </nav>


);
export default mynavbar;

