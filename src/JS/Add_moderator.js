import React, { Component } from 'react';
import axiosFirebase from '../Firebase/axiosFirebase';
import MyTitle from '../Titles/Title'
import SecondaryTitle from '../Titles/SecondaryTitle'

import '../CSS/Add_User.css' /* CSS */

class Add_moderator extends Component {
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
        const moderator = {
            name: this.input.value,
            email: this.input3.value,
        }
        axiosFirebase.post('/moderators.json', moderator).then(function (response) {
            alert('מנחה נוסף');
            window.location.reload();
        });
        //.catch (error => console.log(error));
        e.preventDefault();
    }

    render() {
        return (
            <div>

                <MyTitle title="הוסף מנחה חדש" />

                <div id="show" class="rtt11"><SecondaryTitle title='אנא מלא את כל השדות' > </SecondaryTitle></div>



                <form id="show2" onSubmit={this.handleSubmit} class="row justify-content-md-center">

                    <div class="col-lg-4">
                        <div class="Card bg-white text-center card-form">
                            <div class="card-body">

                                <div class="form-group">
                                    <input type="text" class="form-control form-control-lg text-right" required placeholder="שם מלא" ref={(input) => this.input = input}></input>
                                </div>
                                <div class="form-group">
                                    <input type="email" class="form-control form-control-lg text-right" required placeholder="example@gmail.com" ref={(input3) => this.input3 = input3}></input>
                                </div>
                                <div>
                                    <input type="submit" value="הוסף מנחה" className="btn btn-dark"></input>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

}

export default Add_moderator;