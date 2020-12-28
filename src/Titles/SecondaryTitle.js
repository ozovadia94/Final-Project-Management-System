import React from 'react';

const secondaryTitle = (props) => (
  <div><p></p>
    <div class="jumbotron-fluid py-1 pypy1">
    <div class="container">   
        <div class="display-4 dd4"> {props.title} </div>
    </div>
    </div><p></p>
    <style jsx>{`
        .dd4{
            font-size: 1.25em;
            font-family: 'Secular One', sans-serif;
            background-color: lemonchiffon;
            color: darkslateblue;
            padding: 8px;
          }
          
          
          .pypy1{
            background-color: lemonchiffon;
            color: darkslateblue;
          }

     `}</style>
    </div>
);


export default secondaryTitle;