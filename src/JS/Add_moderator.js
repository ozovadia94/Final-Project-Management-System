import React, { Component } from 'react';
import firebase from '../Firebase/Firebase'
import MyTitle from '../Titles/Title'
import SecondaryTitle from '../Titles/SecondaryTitle'
import alerts from './Alerts'

import '../CSS/Pages.css' /* CSS */

import Moderator_Form from './Moderator_Form'

class Add_moderator extends Component {
    state = {
        moderators: [],
    }

    componentDidMount() {
        var database = firebase.database().ref('moderators/');
        database.on('value', (snapshot) => {
            const res = snapshot.val();

            const fetched = [];
            for (let key in res) {
                fetched.push({
                    ...res[key],
                    id: key
                });
            }
            this.setState({ moderators: fetched });
        })
    }

    handleSubmit = (e) => {
        const moderator = {
            name: document.getElementById('moderator_name').value,
            email: document.getElementById('moderator_email').value,
        }

        for (let key in this.state.moderators) {
            if (this.state.moderators[key].email === moderator.email) {
                e.preventDefault()
                alerts.error('המנחה כבר קיים במערכת')
                return;
            }
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


                <div class="backgroundPage row justify-content-md-center">

                    <div class="col-lg-4">
                        <div class="Card bg-white text-center card-form">
                            <div class="card-body">
                                <Moderator_Form mybut='הוסף מנחה' handleSubmit={() => this.handleSubmit}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default Add_moderator;