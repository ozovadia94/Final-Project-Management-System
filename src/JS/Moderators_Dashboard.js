import React, { Component } from 'react';
import axiosFirebase from '../Firebase/axiosFirebase';
import MyTitle from '../Titles/Title'

import alerts from './Alerts'

import '../CSS/Add_User.css' /* CSS */

class Moderators_Dashboard extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    state = {
        users: [],
        edit: '',
        loading: true,
        selectedUserId: null,
        show: false,
    }


    componentDidMount() {
        axiosFirebase.get('/moderators.json')
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
                console.log(err)
            })
    }


    selectedUserId = (id) => {
        this.setState({ selectedUserId: id });
    }

    editedUserId = (moder) => {
        var moderator_name = document.getElementById("moderator_name");
        moderator_name.value = moder.name
        var moderator_email = document.getElementById("moderator_email");
        moderator_email.value = moder.email

        this.setState({ edit: moder.id });
    }

    deleteUserId = (id) => {
        const del = (id) => {
            axiosFirebase.delete('/moderators/' + id + '.json')
            .then(function (response) {
                alerts.alert('מנחה נמחק!')
            }).catch(error => console.log(error))
        }
        alerts.are_you_sure('האם ברצונך למחוק מנחה זה',id,del)
    }

    handleSubmit(e) {
        const moderator = {
            name: this.input.value,
            email: this.input3.value,
        }

        axiosFirebase.put('moderators/' + this.state.edit + '.json', moderator)
        .then(function (response) {
            alerts.alert('מנחה עודכן')
        }).catch(error => console.log(error));
        e.preventDefault();
    }


    render() {
        return (
            <div>

                <MyTitle title="לוח מנחים" />

                <table class="table table-dark" dir='rtl'>
                    <thead>
                        <tr>
                            <th scope="col">שם</th>
                            <th scope="col">אימייל</th>
                            <th scope="col">עריכה</th>
                            <th scope="col">מחיקה</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.users.map((user, index) => (


                            <tr>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <a href="#home" onClick={() => {
                                        this.editedUserId(user)

                                    }} class="btn btn-outline-warning buttLink Logged-out" data-toggle="modal" data-target="#moderator_edit_form">ערוך</a>
                                </td>
                                <td><button onClick={() => this.deleteUserId(user.id)} type="button" class="btn btn-danger btn-sm">מחק</button> </td>
                            </tr>


                        ))}


                    </tbody>
                </table>

                <div className="col-md-6">

                    <form id="show2" onSubmit={this.handleSubmit} class="row justify-content-md-center">
                        <div class="modal fade" id="moderator_edit_form" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                            <div class="modal-dialog cascading-modal" role="document">
                                <div class="modal-content">
                                    <div class="modal-body mb-1">


                                        <div class="form-group">
                                            <input id='moderator_name' type="text" class="form-control form-control-lg text-right" required placeholder="שם מלא" ref={(input) => this.input = input}></input>
                                        </div>
                                        <div class="form-group">
                                            <input id='moderator_email' type="email" class="form-control form-control-lg text-right" required placeholder="example@gmail.com" ref={(input3) => this.input3 = input3}></input>
                                        </div>

                                    </div>
                                    <button id="buttClose" type="submit" class="btn btn-dark btn-lg">עדכן מנחה</button>
                                    <p></p>

                                    <button type="button" class="btn btn-lg btn-danger" data-dismiss="modal">סגור</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>


            </div>
        );
    }

}

export default Moderators_Dashboard;