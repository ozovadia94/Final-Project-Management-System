import React from 'react';

const secondaryTitle = (props) => (
  <div>
    <div class="jumbotron-fluid py-1 pypy1">
    <div class="container">   
        <div class="dd4"> {props.title} </div>
    </div>
    </div><p></p>
    <style jsx>{`
        .dd4{
            font-size: 
            font-size: 2em;
            font-family: 'Secular One', sans-serif;
            background-color: #34383b;

            color: white;
            padding: 8px;
          }
          
          
          .pypy1{
            font-size: 2em;
            background-color: #34383b;
            color: white;
          }

     `}</style>
    </div>
);


export default secondaryTitle;