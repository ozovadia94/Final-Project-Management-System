import React from 'react';

const title = (props) => (
    <div class="jumbotron-fluid py-1">
    <div class="container">
        <div class="display-4"> {props.title} </div>
    </div>
    <style jsx>{`
        .display-4{
            font-size: 5em;
            font-family: 'Secular One', sans-serif;
            background-color: black
            color: white;
          }
          
          
          .py-1{
            background-color:black;
            color: white;
          }
          
          .jumbotron{
            color: white;
          }
     `}</style>
    </div>
);


export default title;