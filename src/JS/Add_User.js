import React, { Component } from 'react';
import axiosFirebase from '../Firebase/axiosFirebase';
import MyTitle from '../Titles/Title'
import SecondaryTitle from '../Titles/SecondaryTitle'

import '../CSS/Add_User.css' /* CSS */

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
            alert('סטודנט נוסף');
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