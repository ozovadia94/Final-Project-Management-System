import React, { Component } from 'react';
import firebase from '../Firebase/Firebase'
import MyTitle from '../Titles/Title'
import SecondaryTitle from '../Titles/SecondaryTitle'
import alerts from './Alerts'
import Pro_Add_Edit from './Project_AddEdit_Function'

import '../CSS/Pages.css' /* CSS */

class Add_Project extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    state = {
        users: [],
        moderator: [],
        res_data: [],
        loading: true,
        selectedUserId: null,
    }


    async componentDidMount() {
        await Pro_Add_Edit.generateArrayOfYears()
        await this.get_moderators()
        await this.getprojects()
        // .catch(err => {
        //     console.log('HERE!')
        //     this.setState({ loading: false });
        // })
    }

    get_moderators = async () => {
        firebase.database().ref('moderators/')
            .on('value', (snapshot) => {
                const res = snapshot.val();
                const fetchedUsers = [];
                for (let key in res) {
                    fetchedUsers.push({
                        ...res[key],
                        id: key,

                    });
                }
                this.setState({ loading: false, moderator: fetchedUsers, res_data: res.data });
            })

    }

    getprojects = async () => {
        const fetchedUsers = []
        var database_pro = firebase.database().ref('projects/');
        database_pro.on('value', (snapshot) => {
            const res = snapshot.val();
            for (let key in res) {
                // for (let mem in res[key].members) {
                //     // fetchedUsers.push({
                //     //     id: res[key].members[mem].id,
                //     //     email: res[key].members[mem].email,
                //     //     year: res[key].year
                //     // });
                // }
                fetchedUsers.push({
                    ...res[key],
                    id: key
                });

            }
            this.setState({ users: fetchedUsers });
        })
    }

    async handleSubmit(e) {
        
        var mod = document.getElementById("moderator_f");
        var numOfPartners = document.getElementById("members");
        var numOfGits = document.getElementById("numOfgits");

        //Get all the gits from the user
        let gits = []
        for (let k = 0; k < numOfGits.value; k++) {
            let num = k + 1
            gits[k] = document.getElementById("git_id" + num).value
            var ob=document.getElementById("git_id" + num)
            console.log(ob.checkValidity())
        }

        //Get all the members from the user
        let members = []
        for (let k = 0; k < numOfPartners.value; k++) {
            let num = k + 1
            members[k] = {
                id: document.getElementById("member_id" + num).value,
                name: document.getElementById("member_name" + num).value,
                email: (document.getElementById("member_email" + num).value).toLowerCase(),
            }
        }


        await Pro_Add_Edit.check_if_user_exist(this.state.users, members, this.input_year.value)
            .then((x) => {
                if (x !== undefined) {
                    alert(x)
                    return
                }

                var stats;
                if (gits.length === 1)
                    stats = { 0: 0 }
                else {
                    stats = { 0: 0, 1: 0 }
                }

                const user = {
                    name: this.input.value,
                    diary: this.input5.value,
                    moderator_id: mod.value,
                    members: members,
                    gits: gits,
                    date: [],
                    year: this.input_year.value,
                    stats: stats
                }

                var projID = firebase.database().ref().child('projects/').push().key;

                firebase.database().ref('projects/' + projID).set(user)
                    .then((x) => {
                        alerts.alert('פרוייקט נוסף')//true for refresh!
                    }).catch((err) => {
                        console.log('Failed')
                    });



            })

        e.preventDefault();

        // var newPostKey = firebase.database().ref().child('projects/').push().key;
        // var updates = {};
        // updates['/projects/' + newPostKey] = user;

        // firebase.database().ref().update(updates).then((x) => {
        //     alerts.alert('פרוייקט נוסף')//true for refresh!
        // }).catch((err) => {
        //     console.log('Failed')
        // });
    }


    render() {
        return (
            <div className='ozbackground backgroundPage'>

                <MyTitle title="הוסף פרוייקט חדש" />

                <div id="show" class="rtt11"><SecondaryTitle title='אנא מלא את כל השדות' > </SecondaryTitle></div>

                <form id="myForm" onSubmit={this.handleSubmit} class="row justify-content-md-center" dir='rtl'>

                    <div class="">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="project_year">שנת הפרוייקט</label>
                                    <select id="project_year" type='number' class="form-control" required ref={(year) => this.input_year = year}>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="project_name">שם הפרוייקט</label>
                                    <input id="project_name" type="text" class="form-control" required placeholder="שם הפרוייקט" ref={(input) => this.input = input}></input>
                                </div>

                                <div class="form-group">
                                    <label for="moderator_f">מנחה הפרוייקט</label>
                                    <select id="moderator_f" type='text' class="form-control" dir='rtl'>
                                        <option value='Not selected'>בחר מנחה מהרשימה</option>
                                        {this.state.moderator.map((user) => (
                                            <option value={user.id}>{user.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div class="form-group">
                                    <input id='diary' type="text" class="form-control" placeholder="כתובת יומן" ref={(input5) => this.input5 = input5}></input>
                                </div>
                                <div class="form-group">
                                    <label for="numOfgits">גיטהאב</label>
                                    <select id="numOfgits" type='text' name="gits" class="form-control" dir='rtl' onChange={Pro_Add_Edit.addFieldsGits}>
                                        <option selected="selected" value='1'>מספר גיטים: 1</option>
                                        <option value='2'>מספר גיטים: 2</option>
                                    </select>
                                    <div>
                                        <input id="git_id1" type="text" class="form-control" placeholder="git_user/repository" />
                                    </div>
                                    <div id='git2_form' className='nonethings'>
                                        <input id="git_id2" type="text" class="form-control" placeholder="git_user/repository" />
                                    </div>
                                </div>


                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="members">מספר השותפים בפרוייקט</label>
                                    <select id="members" type='text' name="partners" class="form-control" dir='rtl' onChange={Pro_Add_Edit.addFieldsMembers}>
                                        <option selected="selected" value='1'>פרוייקט יחיד</option>
                                        <option value='2'>פרוייקט זוגי</option>
                                    </select>
                                    <div>
                                        <span>סטודנט 1</span>
                                        <input pattern="[0-9]{9}" title="ת.ז מורכב מ9 ספרות" id="member_id1" class="form-control" placeholder="תעודת זהות" required ></input>
                                        <input type="text" id="member_name1" class="form-control" placeholder="שם" required></input>
                                        <input type="email" id="member_email1" class="form-control" placeholder="example@example.com" required></input>
                                    </div>
                                    <div id='member2_form' class="nonethings">
                                        <span>סטודנט 2</span>
                                        <input pattern="[0-9]{9}" title="ת.ז מורכב מ9 ספרות" id="member_id2" class="form-control" placeholder="תעודת זהות" required=""></input>
                                        <input type="text" id="member_name2" class="form-control" placeholder="שם" required=""></input>
                                        <input type="email" id="member_email2" class="form-control" placeholder="example@example.com" required=""></input>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <p></p>

                        
                    <input type="submit" value="הוסף פרוייקט" class="btn btn-dark btn-block"></input>
                    </div>

                </form>
                <br></br>

            </div>
        );
    }

}

export default Add_Project;