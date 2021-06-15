import React, { Component } from 'react';
import firebase from '../Firebase/Firebase'
import MyTitle from '../Titles/Title'
import SecondaryTitle from '../Titles/SecondaryTitle'
import alerts from './Alerts'

import '../CSS/Pages.css' /* CSS */

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

        var newPostKey = firebase.database().ref().child('moderators').push().key;
        firebase.database().ref('moderators/' + newPostKey).set(moderator)
            .then((x) => {
                alerts.alert('מנחה נוסף', false)
                document.getElementById("myForm").reset();
            }).catch(error => console.log(error))
        e.preventDefault();
    }

    render() {
        return (
            <div className='backgroundPage'>

                <MyTitle title="הוסף מנחה חדש" />

                <div id="show" class="rtt11"><SecondaryTitle title='אנא מלא את כל השדות' > </SecondaryTitle></div>



                <form id="myForm" onSubmit={this.handleSubmit} class="backgroundPage row justify-content-md-center">

                    <div class="col-lg-4">
                        <div class="Card bg-white text-center card-form">
                            <div class="card-body">

                                <div class="form-group">
                                    <input type="text" class="form-control form-control-lg text-right" required placeholder="שם מלא" ref={(input) => this.input = input}></input>
                                    <p></p>
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