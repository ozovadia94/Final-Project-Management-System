import React from 'react';

const title = (props) => (
  <div class="jumbotron-fluid py-1">
    <div class="container">
      <div class="display-4"> {props.title} </div>
      {props.sec_title?(<div class="sec_size">{props.sec_title}</div>):(<div></div>)}
    </div>
    


    <style jsx>{`
        .sec_size{
          font-size: 1.3em;
        }
        .display-4{
            font-size: 5em;
            font-family: 'Secular One', sans-serif;
            background-color: black
            color: white;
            text-shadow: 
    -1px -1px 0 #454d55,
    -2px -2px 0 #454d55,
    -3px -3px 0 #454d55,
    -4px -4px 0 #454d55,

    -30px 20px 40px dimgrey
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