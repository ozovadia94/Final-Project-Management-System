import React, { Component } from 'react';
import firebase from '../Firebase/Firebase'
import MyTitle from '../Titles/Title'

import alerts from './Alerts'

import '../CSS/Pages.css' /* CSS */

class Moderators_Dashboard extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getIcons()
    }

    state = {
        users: [],
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

            const fetchedUsers = [];
                for (let key in res) {
                    fetchedUsers.push({
                        ...res[key],
                        id: key
                    });
                }
                this.setState({ loading: false, users: fetchedUsers });
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
        // const del = (id) => {
        //     axiosFirebase.delete('/moderators/' + id + '.json')
        //         .then(function (response) {
        //             alerts.alert('מנחה נמחק!')
        //         }).catch(error => console.log(error))
        // }
        const del = (id) => {
            firebase.database().ref('moderators/' + id).remove().then(()=>{
                alerts.alert('מנחה נמחק!',false)
            })

            // axiosFirebase.delete('/moderators/' + id + '.json')
            //     .then(function (response) {
            //         alerts.alert('מנחה נמחק!')
            //     }).catch(error => console.log(error))
        }
        
        alerts.are_you_sure('האם ברצונך למחוק מנחה זה', id, del)
    }

    handleSubmit(e) {
        const moderator = {
            name: this.input.value,
            email: this.input3.value,
        }

        // axiosFirebase.put('moderators/' + this.state.edit + '.json', moderator)
        //     .then(function (response) {
        //         alerts.alert('מנחה עודכן')
        //     }).catch(error => console.log(error));
        // e.preventDefault();

        
        var updates = {};
        updates['/moderators/' + this.state.edit] = moderator;

        firebase.database().ref().update(updates).then((x) => {
            alerts.alert('פרוייקט נוסף',false)//true for refresh!
        }).catch((err) => {
            console.log(err)
        });
        e.preventDefault();

        document.getElementById('close_but').click()
        
    }


    render() {
        return (
            <div >
                <div className='backgroundPage'>

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

                                        }} class="Logged-out" data-toggle="modal" data-target="#moderator_edit_form"><img src={this.state.icon_edit} /></a>
                                    </td>
                                        
                                    <td><a class='mypointer' onClick={() => this.deleteUserId(user.id)}  ><img src={this.state.icon_delete} /></a></td>
                                       
                                
                                </tr>


                            ))}


                        </tbody>
                    </table>
                </div>

                <div className="col-md-6">

                    <form id="show2" onSubmit={this.handleSubmit} class="row justify-content-md-center">
                        <div class="modal fade" id="moderator_edit_form" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                            <div class="ozbackground modal-dialog cascading-modal" role="document">
                                <div class="ozbackground modal-content">
                                    <div class="ozbackground modal-body">


                                        <div class="form-group">
                                            <input id='moderator_name' type="text" class="form-control form-control-lg text-right" required placeholder="שם מלא" ref={(input) => this.input = input}></input>
                                        </div>
                                        <div class="form-group">
                                            <input id='moderator_email' type="email" class="form-control form-control-lg text-right" required placeholder="example@gmail.com" ref={(input3) => this.input3 = input3}></input>
                                        </div>

                                    </div>
                                    <div class="ozbackground modal-content">
                                        <div class="ozbackground modal-body ozbackground">
                                            <div class="form-group ozbackground">
                                                <button id="update_but" type="submit" class="btn btn-dark btn-lg btn-block">עדכן מנחה</button>
                                                <p></p>

                                                <button id="close_but" type="button" class="btn btn-danger btn-lg btn-block" data-dismiss="modal">סגור</button>
                                            </div>
                                        </div>
                                    </div>
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