import React, { Component } from 'react';
import axiosFirebase from '../Firebase/axiosFirebase';
import MyTitle from '../Titles/Title'
import Student from './‏‏Students'

import './Add_User.css' /* CSS */

class Add_User extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        users: [],
        loading: true,
        selectedUserId: null,
    }


    componentDidMount() {
        axiosFirebase.get('/users.json')
            .then(res => {
                const fetchedUsers = [];
                for (let key in res.data) {
                    fetchedUsers.push({
                        ...res.data[key],
                        id: key
                    });
                }
                this.setState({ loading: false, users: fetchedUsers });
                console.log(fetchedUsers)
            })
            .catch(err => {
                this.setState({ loading: false });
            })
    }


    selectedUserId = (id) => {
        this.setState({ selectedUserId: id });
        alert(id);
    }

    deleteUserId = (id) => {
        const r = window.confirm("האם אתה בטוח?");
        if (r === true) {
            axiosFirebase.delete('/users/' + id + '.json').catch(error => console.log(error)).then(function (response) {
                alert('אירוע נמחק');

            }).then(function (response) {
                window.location.reload();
            });

        }
    }


    studentclick = (user) => {
        <div>
        <Student
            gituser={user.gituser}
            gitproject={user.gitproject}
        />

        </div>
        alert(user.gituser + ' ~ ' + user.gitproject);
    }



    render() {
        return (
            <div>

                <MyTitle title="לוח סטודנטים" />

                <table class="table table-dark">
                    <thead>
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Git User</th>
                            <th scope="col">Git Project</th>
                            <th scope="col">Jira</th>
                            <th scope="col">Git Going</th>
                            <th scope="col">delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.users.map(user => (


                            <tr>
                                <td>{user.idd}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.gituser}</td>
                                <td>{user.gitproject}</td>
                                <td>{user.jira}</td>
                                <td><a href="#home" onClick={() => this.studentclick(user)} class="btn btn-outline-warning buttLink Logged-out" data-toggle="modal" data-target="#modalLRForm">חלון התקדמות בגיט</a>
                                <Student
            gituser={user.gituser}
            gitproject={user.gitproject}
        />

                                </td>

                                <td><button onClick={(user) => this.deleteUserId(user.id)} type="button" class="btn btn-danger btn-sm">מחק</button> </td>
                            </tr>
                        ))}

                    </tbody>
                </table>


            </div>
        );
    }

}

export default Add_User;