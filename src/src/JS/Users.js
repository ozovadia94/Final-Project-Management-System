import React from 'react';
import Student from './‏‏Students'

const user = (props) => (

      <tr>
            <td>{props.id}</td>
            <td>{props.name}</td>
            <td>{props.email}</td>
            <td>{props.gituser}</td>
            <td>{props.gitproject}</td>
            <td>{props.jira}</td>
            <td><a href="#home" class="btn btn-outline-warning buttLink Logged-out" data-toggle="modal" data-target="#modalLRForm">חלון התקדמות בגיט</a>

                  <Student
                        gituser={props.gituser}
                        gitproject={props.gitproject}
                  />
            </td>



            <td><button onClick={props.clicked} type="button" class="btn btn-danger btn-sm">מחק</button> </td>
      </tr>


);
export default user;

