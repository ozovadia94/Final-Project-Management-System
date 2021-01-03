import React, { Component } from 'react';
import axiosFirebase from '../Firebase/axiosFirebase';
import MyTitle from '../Titles/Title'
import SecondaryTitle from '../Titles/SecondaryTitle'
import Users from './Users'
import Student from './‏‏Students'

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

    progress_in_Git = (gituser,gitproject) => {
        alert('XXX')
        window.open('','MyWindow','toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,width=600,height=300')

        {<Student
              gituser={gituser}
              gitproject={gitproject}
        />}
    }


    handleSubmit(e) {
        const user = {
            name: this.input.value,
            idd: this.input2.value,
            email: this.input3.value,
            gituser: this.input4.value,
            gitproject: this.input6.value,
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

                <MyTitle title="הוסף סטודנט חדש" />

                <div id="show" class="rtt11"><SecondaryTitle title='אנא מלא את כל השדות' > </SecondaryTitle></div>



                <form id="show2" onSubmit={this.handleSubmit} class="row justify-content-md-center">

                    <div class="col-lg-4">
                        <div class="Card bg-white text-center card-form">
                            <div class="card-body">

                                <div class="form-group">
                                    <input type="text" class="form-control form-control-lg text-right" required placeholder="שם מלא" ref={(input) => this.input = input}></input>
                                </div>
                                <div class="form-group">
                                    <input type="number" class="form-control form-control-lg text-right" required placeholder="תעודת זהות" ref={(input2) => this.input2 = input2}></input>
                                </div>
                                <div class="form-group">
                                    <input type="email" class="form-control form-control-lg text-right" required placeholder="example@gmail.com" ref={(input3) => this.input3 = input3}></input>
                                </div>
                                <div class="form-group">
                                    <input type="text" class="form-control form-control-lg text-right" placeholder="משתמש גיט" ref={(input4) => this.input4 = input4}></input>
                                </div>
                                <div class="form-group">
                                    <input type="text" class="form-control form-control-lg text-right" placeholder="פרוייקט בגיט" ref={(input6) => this.input6 = input6}></input>
                                </div>
                                <div class="form-group">
                                    <input type="text" class="form-control form-control-lg text-right" placeholder="כתובת ג'ירה" ref={(input5) => this.input5 = input5}></input>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <input type="submit" value="הגש בקשה" className="btn btn btn-info btn-sm center-block agreeBut"></input>
                    </div>

                </form>


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
                                <Users
                                    name={user.name}
                                    id={user.idd}
                                    email={user.email}
                                    gituser={user.gituser}
                                    gitproject={user.gitproject}
                                    jira={user.jira}
                                    clicked={() => this.deleteUserId(user.id)}
                                    clicked2={() => this.progress_in_Git(user.gituser,user.gitproject)}


                                />
                        ))}

                    </tbody>
                </table>


            </div>
        );
    }

}

export default Add_User;