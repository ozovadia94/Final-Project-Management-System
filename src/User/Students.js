import React, { Component } from 'react';
import axiosFirebase from '../Firebase/axiosFirebase';
import MyTitle from '../Titles/Title'
import SecondaryTitle from '../Titles/SecondaryTitle'
import Users from './Users'
import axios from 'axios';

import './Add_User.css' /* CSS */

class Add_User extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    state = {
        users: [],
        loading: true,
        selectedUserId: null,
        gitdiv: [],
    }


    componentDidMount() {
        axios.get('https://api.github.com/repos/roipinto/YeshTikva/commits', {
            ref: 'ref'
          })
            .then(res => {
                const fetchedUsers = [];
                for (let key in res.data) {
                    fetchedUsers.push({
                        ...res.data[key],
                        id: key
                    });
                }
                this.setState({ loading: false, users: fetchedUsers });
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


    handleSubmit(e) {
        const user = {
            name: this.input.value,
            id: this.input2.value,
            email: this.input3.value,
            git: this.input4.value,
            jira: this.input5.value
        }
        axiosFirebase.post('/users.json', user).then(function (response) {
            window.location.reload();
        });
        //.catch (error => console.log(error));
        e.preventDefault();
    }

    render() {
        return (
            <div>

                <MyTitle title="לוח התקדמות" />

                <div>
                    <table>
                        <tr>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Changes</th>
                        </tr>

                    {this.state.users.map(com => (
                        <tr>
                            <td>{com.commit.committer.date}</td>
                            <td>{com.commit.message}</td>
                            <td>{}</td>
                        </tr>

                        ))}
                    </table>

                </div>

                {this.state.users.map(user => (
                    <Users
                        name={user.name}
                        id={user.id}
                        email={user.email}
                        git={user.git}
                        jira={user.jira}
                        clicked={() => this.deleteUserId(user.id)}
                    />

                ))}


            </div>
        );
    }

}

export default Add_User;