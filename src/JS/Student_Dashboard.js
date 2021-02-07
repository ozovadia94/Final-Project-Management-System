import React, { Component } from 'react';
import axiosFirebase from '../Firebase/axiosFirebase';
import MyTitle from '../Titles/Title'

import alerts from './Alerts'
import '../CSS/Add_User.css' /* CSS */

class Add_User extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    state = {
        res_moder: [],
        moderator: [],
        users: [],
        edit: '',
        loading: true,
        selectedUserId: null,
        show: false,
    }


    componentDidMount() {

        const fetchedUsers = [];
        axiosFirebase.get('/users.json')
            .then(res => {
                for (let key in res.data) {
                    fetchedUsers.push({
                        ...res.data[key],
                        id: key
                    });
                }
            }).then(() => {
                axiosFirebase.get('/moderators.json')
                    .then(res => {
                        const fetched = [];
                        for (let key in res.data) {
                            fetched.push({
                                ...res.data[key],
                                id: key
                            });
                        }
                        this.setState({ res_moder: res.data, moderator: fetched });
                        return res.data
                    }).then((res) => {
                        for (let key in fetchedUsers) {
                            if(res[fetchedUsers[key].moderator_id]!==undefined)
                                fetchedUsers[key]['mod_name'] = res[fetchedUsers[key].moderator_id].name
                            else
                                fetchedUsers[key]['mod_name']='לא נבחר מנחה!'
                                
                        }
                    }).then(() => {
                        this.setState({ users: fetchedUsers });
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {
                this.setState({ loading: false });
                console.log(err)
            })

    }


    selectedUserId = (id) => {
        this.setState({ selectedUserId: id });
    }

    deleteUserId = (id) => {
        const del = (id) => {
            axiosFirebase.delete('/users/' + id + '.json')
                .then(function (response) {
                    alerts.alert('סטודנט נמחק')
                }).catch(error => console.log(error))
        }
        alerts.are_you_sure('האם ברצונך למחוק סטודנט זה', id, del)
    }

    studentclick = (user) => {
        window.open('/Students?gituser=' + user.gituser + '&gitproject=' + user.gitproject, 'MyWindow', 'toolbar=no,location=no,directories=no,status=no, menubar=no,scrollbars=no,resizable=no,width=900,height=600')
    }

    myEdit = (user) => {
        var student_name = document.getElementById("student_name");
        student_name.value = user.name
        var student_id = document.getElementById("student_id");
        student_id.value = user.idd
        var student_email = document.getElementById("student_email");
        student_email.value = user.email
        var moderator_f = document.getElementById("moderator_f");
        moderator_f.value = user.moderator_id

        if (user.gituser !== undefined) {
            var student_gitUser = document.getElementById("student_gitUser");
            student_gitUser.value = user.gituser
        }


        if (user.gitproject !== undefined) {
            var student_gitProject = document.getElementById("student_gitProject");
            student_gitProject.value = user.gitproject
        }

        if (user.daybook !== undefined) {
            var student_daybook = document.getElementById("student_daybook");
            student_daybook.value = user.daybook
        }
        this.setState({ edit: user.id });
    }




    handleSubmit(e) {
        var mod = document.getElementById("moderator_f");

        const user = {
            name: this.input.value,
            idd: this.input2.value,
            email: this.input3.value,
            gituser: this.input4.value,
            gitproject: this.input6.value,
            jira: this.input5.value,
            moderator_id: mod.value,
        }

        axiosFirebase.put(`users/` + this.state.edit + '.json', user)
        .then(function (response) {
            alerts.alert('סטודנט עודכן')
        })
        .catch(error => console.log(error));
        e.preventDefault();
    }

    render() {
        return (
            <div>

                <MyTitle title="לוח סטודנטים" />

                <table class="table table-dark" dir='rtl'>
                    <thead>
                        <tr>
                            <th scope="col">תעודת זהות</th>
                            <th scope="col">שם</th>
                            <th scope="col">אימייל</th>
                            <th scope="col">מנחה</th>
                            <th scope="col">משתמש בגיט</th>
                            <th scope="col">פרוייקט בגיט</th>
                            <th scope="col">Jira</th>
                            <th scope="col">מצב התקדמות בגיט</th>
                            <th scope="col">עריכה</th>
                            <th scope="col">מחיקה</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.users.map((user, index) => (


                            <tr>
                                <td>{user.idd}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>

                                <td>{user.mod_name}</td>
                                <td>{user.gituser}</td>
                                <td>{user.gitproject}</td>
                                <td>{user.jira}</td>
                                <td><a href="/" onClick={() => this.studentclick(user)} class="btn btn-outline-warning buttLink Logged-out" data-toggle="modal">חלון התקדמות בגיט</a>
                                </td>

                                <td>
                                    <a href="#home" onClick={() => {
                                        this.myEdit(user)

                                    }} class="btn btn-outline-warning buttLink Logged-out" data-toggle="modal" data-target="#modalLRForm">ערוך</a>
                                </td>







                                <td><button onClick={() => this.deleteUserId(user.id)} type="button" class="btn btn-danger btn-sm">מחק</button></td>
                            </tr>


                        ))}


                    </tbody>
                </table>



                <div className="col-md-6">

                    <form id="show2" onSubmit={this.handleSubmit} class="row justify-content-md-center">
                        <div class="modal fade" id="modalLRForm" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                            <div class="modal-dialog cascading-modal" role="document">
                                <div class="modal-content">
                                    <div class="modal-body mb-1">


                                        <div class="form-group" id='myform'>
                                            <input id='student_name' type="text" class="form-control form-control-lg text-right" required placeholder="שם מלא" ref={(input) => this.input = input}></input>
                                            <p></p>
                                            <input id='student_id' type="number" class="form-control form-control-lg text-right" required placeholder="תעודת זהות" ref={(input2) => this.input2 = input2}></input>
                                            <p></p>
                                            <input id='student_email' type="email" class="form-control form-control-lg text-right" required placeholder="example@gmail.com" ref={(input3) => this.input3 = input3}></input>
                                            <p></p>

                                            <select id="moderator_f" name="cars" class="form-control form-control-lg text-right" dir='rtl'>
                                                <option value='Not selected'>בחר מנחה מהרשימה</option>
                                                {this.state.moderator.map((user) => (
                                                    <option value={user.id}>{user.name}</option>
                                                ))}
                                            </select>

                                            <p></p>
                                            <input id='student_gitUser' type="text" class="form-control form-control-lg text-right" placeholder="משתמש גיט" ref={(input4) => this.input4 = input4}></input>
                                            <p></p>
                                            <input id='student_gitProject' type="text" class="form-control form-control-lg text-right" placeholder="פרוייקט בגיט" ref={(input6) => this.input6 = input6}></input>
                                            <p></p>
                                            <input id='student_daybook' type="text" class="form-control form-control-lg text-right" placeholder="כתובת יומן" ref={(input5) => this.input5 = input5}></input>
                                        </div>


                                    </div>
                                    <button id="buttClose" type="submit" class="btn btn-dark btn-lg">עדכן סטודנט</button>
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

export default Add_User;