import React, { Component } from 'react';
import axios from '../Firebase/axios';
import MyTitle from '../Titles/Title'
import SecondaryTitle from '../Titles/SecondaryTitle'
import Users from './Users'

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
        axios.get('/users.json')
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
            axios.delete('/users/' + id + '.json').catch(error => console.log(error)).then(function (response) {
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
        axios.post('/users.json', user).then(function (response) {
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
                                    <input type="text" class="form-control form-control-lg text-right" placeholder="כתובת גיט" ref={(input4) => this.input4 = input4}></input>
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