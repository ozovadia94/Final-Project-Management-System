import React, { Component } from 'react';
import firebase from '../Firebase/Firebase'
import MyTitle from '../Titles/Title'

import alerts from './Alerts'
import ModerForm from './Moderator_Form'
import '../CSS/Pages.css' /* CSS */


class Moderators_Dashboard extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getIcons()
    }

    state = {
        moderators: [],
        edit: '',
        loading: true,
        selectedUserId: null,
        show: false,
        icon_edit: '',
        icon_delete: '',
    }

    getIcons() {
        firebase.storage().ref("images/").child('icons8-edit-36.png').getDownloadURL().then((url) => {
            this.setState({ icon_edit: url })
        }).catch((error) => console.log(error))

        firebase.storage().ref("images/").child('icons8-delete-24.png').getDownloadURL().then((url) => {
            this.setState({ icon_delete: url })
        }).catch((error) => console.log(error))
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
            this.setState({ loading: false, moderators: fetched });
        })
    }


    selectedUserId = (id) => {
        this.setState({ selectedUserId: id });
    }



    deleteUserId = (id) => {
        // const del = (id) => {
        //     axiosFirebase.delete('/moderators/' + id + '.json')
        //         .then(function (response) {
        //             alerts.alert('מנחה נמחק!')
        //         }).catch(error => console.log(error))
        // }
        const del = (id) => {
            firebase.database().ref('moderators/' + id).remove().then(() => {
                alerts.alert('מנחה נמחק!', false)
            })

            // axiosFirebase.delete('/moderators/' + id + '.json')
            //     .then(function (response) {
            //         alerts.alert('מנחה נמחק!')
            //     }).catch(error => console.log(error))
        }

        alerts.are_you_sure('האם ברצונך למחוק מנחה זה', id, del)
    }

    handleSubmit(e) {
        var cur;
        const moderator = {
            name: document.getElementById('moderator_name').value,
            email: (document.getElementById('moderator_email').value).toLowerCase(),
        }

        for (let key in this.state.moderators) {
            cur = this.state.moderators[key]
            if (cur.email === moderator.email) {
                if (cur.id === this.state.edit)
                    continue
                else {
                    e.preventDefault()
                    alerts.error('יתכן כי הינך מנסה לשנות את המייל למייל שקיים כבר אצל מנחה אחר')
                    return;
                }
            }
        }

        var updates = {};
        updates['/moderators/' + this.state.edit] = moderator;

        firebase.database().ref().update(updates).then((x) => {
            alerts.alert('מנחה עודכן', false)//true for refresh!
        }).catch((err) => {
            console.log(err)
        });
        e.preventDefault();

        document.getElementById('close_but').click()

    }

    editedUserId = (moder) => {
        var moderator_name = document.getElementById("moderator_name");
        moderator_name.value = moder.name
        var moderator_email = document.getElementById("moderator_email");
        moderator_email.value = moder.email

        this.setState({ edit: moder.id });
    }


    render() {
        return (
            <div >
                <div className='ozbackground'>

                    <MyTitle title="לוח מנחים" />

                    <br></br>

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
                            {this.state.moderators.map((user, index) => (


                                <tr>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <img onClick={() => { this.editedUserId(user) }} src={this.state.icon_edit} alt='mod_edit_image' class="mypointer" data-toggle="modal" data-target="#moderator_edit_form" />
                                    </td>
                                    <td><img src={this.state.icon_delete} class='mypointer' onClick={() => this.deleteUserId(user.id)} alt='mod_delete_image'></img></td>
                                </tr>


                            ))}


                        </tbody>
                    </table>
                </div>

                <div className="col-md-6">

                    <div id="show2" class="row justify-content-md-center">
                        <div class="modal fade" id="moderator_edit_form" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                            <div class="ozbackground modal-dialog cascading-modal" role="document">
                                <div class="ozbackground modal-content">
                                    <div class="ozbackground modal-body">

                                        <ModerForm mybut='עדכן מנחה' handleSubmit={() => this.handleSubmit}></ModerForm>

                                    </div>
                                    <div class="ozbackground modal-content">
                                        <div class="ozbackground modal-body ozbackground">
                                            <div class="form-group ozbackground">
                                                <p></p>
                                                <button id="close_but" type="button" class="btn btn-danger btn-lg btn-block" data-dismiss="modal">סגור</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <br></br>
                <p></p>
            </div>
        );
    }

}

export default Moderators_Dashboard;