import React, { Component } from 'react';
import axiosFirebase from '../Firebase/axiosFirebase';
import MyTitle from '../Titles/Title'
import SecondaryTitle from '../Titles/SecondaryTitle'
import alerts from './Alerts'

import '../CSS/Pages.css' /* CSS */

class Add_User extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        axiosFirebase.get('/moderators.json')
            .then(res => {
                const fetchedUsers = [];
                for (let key in res.data) {
                    fetchedUsers.push({
                        ...res.data[key],
                        id: key,

                    });
                }
                this.setState({ loading: false, moderator: fetchedUsers, res_data: res.data });
            })
            .catch(err => {
                this.setState({ loading: false });
            })
    }

    state = {
        moderator: [],
        res_data: [],
        loading: true,
        selectedUserId: null,
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
        axiosFirebase.post('/users.json', user).then(function (response) {
            alerts.alert('סטודנט נוסף',false)
            document.getElementById("myForm").reset();
        }).catch(error => console.log(error));
        e.preventDefault();
    }

    render() {
        return (
            <div className='backgroundPage'>

                <MyTitle title="הוסף סטודנט חדש" />

                <div id="show" class="rtt11"><SecondaryTitle title='אנא מלא את כל השדות' > </SecondaryTitle></div>



                <form id="myForm" onSubmit={this.handleSubmit} class="row justify-content-md-center" dir='rtl'>

                    <div class="col-lg-4">
                        <div class="Card bg-white text-center card-form">
                            <div class="card-body">

                                <div class="form-group" >
                                    <input type="text" class="form-control form-control-lg text-right" required placeholder="שם מלא" ref={(input) => this.input = input}></input>
                                    <p></p>
                                    <input type="number" class="form-control form-control-lg text-right" required placeholder="תעודת זהות" ref={(input2) => this.input2 = input2}></input>
                                    <p></p>
                                    <input type="email" class="form-control form-control-lg text-right" required placeholder="example@gmail.com" ref={(input3) => this.input3 = input3}></input>
                                    <p></p>
                                    <select id="moderator_f" name="cars" class="form-control form-control-lg text-right" dir='rtl'>
                                        <option value='Not selected'>בחר מנחה מהרשימה</option>
                                        {this.state.moderator.map((user) => (
                                            <option value={user.id}>{user.name}</option>
                                        ))}
                                    </select>
                                </div></div></div></div>
                                
                    <div class="col-lg-4">
                        <div class="Card bg-white text-center card-form">
                            <div class="card-body">
                                <div class="form-group">
                                    <input type="text" class="form-control form-control-lg text-right" placeholder="משתמש גיט" ref={(input4) => this.input4 = input4}></input>
                                    <p></p>
                                    <input type="text" class="form-control form-control-lg text-right" placeholder="פרוייקט בגיט" ref={(input6) => this.input6 = input6}></input>
                                    <p></p>
                                    <input type="text" class="form-control form-control-lg text-right" placeholder="כתובת יומן" ref={(input5) => this.input5 = input5}></input>
                                </div>

                                <div>
                                    <input type="submit" value="הוסף סטודנט" className="btn btn-dark"></input>
                                </div>
                            </div>
                        </div>
                    </div>



                </form>
            </div>
        );
    }

}

export default Add_User;