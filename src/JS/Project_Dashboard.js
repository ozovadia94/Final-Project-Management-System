import React, { Component } from 'react';
import firebase from '../Firebase/Firebase'
import MyTitle from '../Titles/Title'

import alerts from './Alerts'
import '../CSS/Pages.css' /* CSS */


class Project_Dashboard extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addFieldsMembers = this.addFieldsMembers.bind(this)
        this.projects_Ref = firebase.database().ref().child('projects');
        this.moderators_Ref = firebase.database().ref().child('moderators');
    }

    state = {
        moderators: [],
        users: [],
        moder_res: [],
        edit: '',
        loading: true,
        selectedUserId: null,
        show: false,
    }


    get_project_mod = () => {
        const fetchedUsers = [];
        var database_pro = firebase.database().ref('projects/');
        database_pro.on('value', (snapshot) => {
            const res = snapshot.val();
            for (let key in res) {
                fetchedUsers.push({
                    ...res[key],
                    id: key
                });
            }
        })

        var database_mod = firebase.database().ref('moderators/');
        const fetched = [];
        database_mod.on('value', (snapshot) => {
            const res = snapshot.val();
            for (let key in res) {
                fetched.push({
                    ...res[key],
                    id: key
                });
            }

            this.setState({ moderators: fetched });

            for (let key in fetchedUsers) {
                if (fetchedUsers[key].moderator_id === 'Not selected')
                    fetchedUsers[key]['mod_name'] = 'לא נבחר מנחה!'
                else
                    fetchedUsers[key]['mod_name'] = res[fetchedUsers[key].moderator_id].name

            }

            this.setState({ users: fetchedUsers });
        })

    }

    componentDidMount() {
        this.get_project_mod()
    }


    selectedUserId = (id) => {
        this.setState({ selectedUserId: id });
    }

    deleteUserId = (id) => {

        const del = (id) => {
            firebase.database().ref('projects/' + id).remove().then(() => {
                alerts.alert('סטודנט נמחק')
            })
        }

        // const del = (id) => {
        //     axiosFirebase.delete('/projects/' + id + '.json')
        //         .then(function (response) {
        //             alerts.alert('סטודנט נמחק')
        //         }).catch(error => console.log(error))
        // }
        alerts.are_you_sure('האם ברצונך למחוק סטודנט זה', id, del)
    }

    studentclick = (user, key) => {
        window.open('/Students?git=' + user.gits[key], 'MyWindow', 'toolbar=no,location=no,directories=no,status=no, menubar=no,scrollbars=no,resizable=no,width=900,height=600')
    }

    addFieldsMembers = () => {
        // Number of inputs to create
        var numberOfmembers = document.getElementById("members");
        if (numberOfmembers === null)
            return
        else
            numberOfmembers = numberOfmembers.value

        var container = document.getElementById("container");//container of members

        var sum_element_now = container.childElementCount

        if (numberOfmembers > sum_element_now) {
            for (var i = sum_element_now; i < numberOfmembers; i++) {
                // Append a node with a random text
                let num = i + 1

                var input1 = document.createElement("input");
                input1.type = "number";
                input1.id = "member_id" + num;
                input1.className = "form-control form-control-lg text-right"
                input1.placeholder = "תעודת זהות"
                input1.required = true
                var input2 = document.createElement("input");
                input2.type = "email";
                input2.id = "member_mail" + num;
                input2.className = "form-control form-control-lg text-right"
                input2.placeholder = "example@example.com"
                input2.required = true
                var input3 = document.createElement("input");
                input3.type = "text";
                input3.id = "member_name" + num;
                input3.className = "form-control form-control-lg text-right"
                input3.placeholder = "שם"
                input3.required = true

                var input = document.createElement("div");
                input.appendChild(document.createTextNode("סטודנט " + num));
                input.appendChild(document.createElement("br"));
                input.appendChild(input1)
                input.appendChild(input3)
                input.appendChild(input2)
                input.appendChild(document.createElement("br"));


                container.appendChild(input);
            }
        }
        else
            for (let y = sum_element_now; y > numberOfmembers; y--)
                y = container.removeChild(container.lastChild)
    }
    addFieldsGits = () => {
        // Number of inputs to create
        var numberOfGits = document.getElementById("numOfgits");
        if (numberOfGits === null)
            return
        else
            numberOfGits = numberOfGits.value

        // Container <div> where dynamic content will be placed
        var container = document.getElementById("containerGit");

        var sum_element_now = container.childElementCount

        if (numberOfGits > sum_element_now) {
            for (var i = sum_element_now; i < numberOfGits; i++) {
                // Append a node with a random text

                var input1 = document.createElement("input");
                input1.type = "text";
                input1.id = "git_id" + (i + 1);
                input1.className = "form-control form-control-lg text-right"
                input1.placeholder = "git_user/repository"

                input1.appendChild(document.createElement("p"));
                container.appendChild(input1);
                // Append a line break 

            }
        }
        else
            for (let y = sum_element_now; y > numberOfGits; y--)
                y = container.removeChild(container.lastChild)
    }

    myEdit = (user) => {
        var project_name = document.getElementById("project_name");
        project_name.value = user.name
        var numberOfmembers = document.getElementById("members");
        numberOfmembers.value = user.partners

        var numberOfGits = document.getElementById("numOfgits");
        numberOfGits.value = user.numOfGits


        var moderator_f = document.getElementById("moderator_f");
        moderator_f.value = user.moderator_id

        if (user.daybook !== undefined) {
            var student_daybook = document.getElementById("daybook");
            student_daybook.value = user.daybook
        }

        async function addFieldsMembers() {
            // Number of inputs to create
            var numberOfmembers = document.getElementById("members");
            if (numberOfmembers === null)
                return
            else
                numberOfmembers = numberOfmembers.value

            var container = document.getElementById("container");//container of members

            var sum_element_now = container.childElementCount

            if (numberOfmembers > sum_element_now) {
                for (var i = sum_element_now; i < numberOfmembers; i++) {
                    // Append a node with a random text
                    let num = i + 1

                    var input1 = document.createElement("input");
                    input1.type = "number";
                    input1.id = "member_id" + num;
                    input1.className = "form-control form-control-lg text-right"
                    input1.placeholder = "תעודת זהות"
                    input1.required = true
                    var input2 = document.createElement("input");
                    input2.type = "email";
                    input2.id = "member_mail" + num;
                    input2.className = "form-control form-control-lg text-right"
                    input2.placeholder = "example@example.com"
                    input2.required = true
                    var input3 = document.createElement("input");
                    input3.type = "text";
                    input3.id = "member_name" + num;
                    input3.className = "form-control form-control-lg text-right"
                    input3.placeholder = "שם"
                    input3.required = true

                    var input = document.createElement("div");
                    input.appendChild(document.createTextNode("סטודנט " + num));
                    input.appendChild(document.createElement("br"));
                    input.appendChild(input1)
                    input.appendChild(input3)
                    input.appendChild(input2)
                    input.appendChild(document.createElement("br"));


                    container.appendChild(input);
                }
            }
            else
                for (let y = sum_element_now; y > numberOfmembers; y--)
                    y = container.removeChild(container.lastChild)
        }

        async function addFieldsGits() {
            // Number of inputs to create
            var numberOfGits = document.getElementById("numOfgits");
            if (numberOfGits === null)
                return
            else
                numberOfGits = numberOfGits.value

            // Container <div> where dynamic content will be placed
            var container = document.getElementById("containerGit");

            var sum_element_now = container.childElementCount

            if (numberOfGits > sum_element_now) {
                for (var i = sum_element_now; i < numberOfGits; i++) {
                    // Append a node with a random text

                    var input1 = document.createElement("input");
                    input1.type = "text";
                    input1.id = "git_id" + (i + 1);
                    input1.className = "form-control form-control-lg text-right"
                    input1.placeholder = "git_user/repository"

                    input1.appendChild(document.createElement("p"));
                    container.appendChild(input1);
                    // Append a line break 

                }
            }
            else
                for (let y = sum_element_now; y > numberOfGits; y--)
                    y = container.removeChild(container.lastChild)
        }

        addFieldsMembers();
        addFieldsGits();

        let num;
        for (let i = 0; i < numberOfmembers.value; i++) {
            num = i + 1
            document.getElementById("member_id" + num).value = user.members[i].id
            document.getElementById("member_mail" + num).value = user.members[i].email
            document.getElementById("member_name" + num).value = user.members[i].name
        }

        for (let i = 0; i < numberOfGits.value; i++) {
            num = i + 1
            document.getElementById("git_id" + num).value = user.gits[i]
        }

        this.setState({ edit: user.id });
    }

    handleSubmit(e) {
        var mod = document.getElementById("moderator_f");
        var numOfPartners = document.getElementById("members");
        var numOfGits = document.getElementById("numOfgits");

        let gits = []
        for (let k = 0; k < numOfGits.value; k++) {
            let num = k + 1
            gits[k] = document.getElementById("git_id" + num).value
        }

        let members = []
        for (let k = 0; k < numOfPartners.value; k++) {
            let num = k + 1
            members[k] = {
                id: document.getElementById("member_id" + num).value,
                name: document.getElementById("member_name" + num).value,
                email: document.getElementById("member_mail" + num).value,
            }
        }

        const user = {
            name: this.input.value,
            partners: numOfPartners.value,
            daybook: this.input5.value,
            moderator_id: mod.value,
            members: members,
            numOfGits: numOfGits.value,
            gits: gits,
        }

        // axiosFirebase.put(`projects/` + this.state.edit + '.json', user)
        //     .then(function (response) {
        //         alerts.alert('פרוייקט עודכן')
        //     })
        //     .catch(error => console.log(error));
        // e.preventDefault();


        var updates = {};
        updates['/projects/' + this.state.edit] = user;

        firebase.database().ref().update(updates).then((x) => {
            alerts.alert('פרוייקט עודכן')//true for refresh!
        }).catch((err) => {
            console.log(err)
        });
        e.preventDefault();

        document.getElementById('close_but').click()
    }

    render() {
        return (
            <div className='ozbackground spec'>

                <MyTitle title="לוח פרוייקטים" />

                <div className='ozbackground'>
                    <table class="table table-dark" dir='rtl'>
                        <thead>
                            <tr>
                                <th scope="col">שם הפרוייקט</th>
                                <th scope="col">מספר שותפים</th>
                                <th scope="col">ת.ז</th>
                                <th scope="col">שמות</th>
                                <th scope="col">אימיילים</th>
                                <th scope="col">מנחה</th>
                                <th scope="col">יומן</th>
                                <th scope="col">מצב התקדמות בגיט</th>
                                <th scope="col">עריכה</th>
                                <th scope="col">מחיקה</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.users.map((user, index) => (



                                <tr>
                                    <td>{user.name}</td>
                                    <td>{user.partners}</td>
                                    <td><div>{user.members[0].id}</div>
                                        {user.members[1] ? (<div><p></p> {user.members[1].id}</div>) : (<div></div>)}
                                    </td>
                                    <td><div>{user.members[0].name}</div>
                                        {user.members[1] ? (<div><p></p>{user.members[1].name}</div>) : (<div></div>)}
                                    </td>
                                    <td><div>{user.members[0].email}</div>
                                        {user.members[1] ? (<div><p></p>{user.members[1].email}</div>) : (<div></div>)}
                                    </td>



                                    <td>{user.mod_name}</td>
                                    <td>{user.daybook}</td>
                                    <td><a href="/" onClick={() => this.studentclick(user, 0)} class="btn btn-outline-warning buttLink Logged-out" data-toggle="modal">חלון התקדמות בגיט</a>
                                        {user.numOfGits > 1 ? (<div><p></p> <a href="/" onClick={() => this.studentclick(user, 1)} class="btn btn-outline-warning buttLink Logged-out" data-toggle="modal">חלון התקדמות בגיט</a></div>) : (<div></div>)}
                                    </td>

                                    <td>
                                        <a href="#home" onClick={() => {
                                            this.myEdit(user)

                                        }} class="btn btn-outline-warning buttLink Logged-out" data-toggle="modal" data-target="#modalLRForm">ערוך</a>
                                    </td>







                                    <td><button onClick={() => this.deleteUserId(user.id)} type="button" class="btn btn-danger btn-sm">מחק</button></td>
                                </tr>


                            ))}


                        </tbody>
                    </table>
                </div>



                <div className="col-md-6">

                    <form id="show2" onSubmit={this.handleSubmit} class="row justify-content-md-center">
                        <div class="modal fade" id="modalLRForm" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                            <div class="modal-dialog cascading-modal" role="document">
                                <div class="modal-content">
                                    <div class="modal-body mb-1">


                                        <div class="form-group" id='myform'>
                                            <input id='project_name' type="text" class="form-control form-control-lg text-right" required placeholder="שם הפרוייקט" ref={(input) => this.input = input}></input>
                                            <p></p>
                                            <select id="moderator_f" type='text' name="cars" class="form-control form-control-lg text-right" dir='rtl'>
                                                <option value='Not selected'>בחר מנחה מהרשימה</option>
                                                {this.state.moderators.map((user) => (
                                                    <option value={user.id}>{user.name}</option>
                                                ))}
                                            </select>


                                            <p></p>
                                            <select id="members" type='text' name="partners" class="form-control form-control-lg text-right" dir='rtl' onChange={this.addFieldsMembers}>
                                                <option selected="selected" value='1'>פרוייקט יחיד</option>
                                                <option value='2'>פרוייקט זוגי</option>
                                            </select>


                                            <div class="form-group" id="container">
                                                <div>
                                                    סטודנט 1<br />
                                                    <input type="number" id="member_id1" class="form-control form-control-lg text-right" placeholder="תעודת זהות" required></input>
                                                    <input type="text" id="member_name1" class="form-control form-control-lg text-right" placeholder="שם" required></input>
                                                    <input type="email" id="member_mail1" class="form-control form-control-lg text-right" placeholder="example@example.com" required></input>
                                                </div>
                                            </div>

                                            <p></p><p></p><p></p>

                                            <p></p>
                                            <input id='daybook' type="text" class="form-control form-control-lg text-right" placeholder="כתובת יומן" ref={(input5) => this.input5 = input5}></input>
                                            <p></p>

                                            <select id="numOfgits" type="text" name="gits" class="form-control form-control-lg text-right" dir='rtl' onChange={this.addFieldsGits}>
                                                <option selected="selected" value='1'>1</option>
                                                <option value='2'>2</option>
                                            </select>
                                            <div class="form-group" id="containerGit">
                                                <input id="git_id1" type="text" class="form-control form-control-lg text-right" placeholder="git_user/repository" ></input>
                                            </div>



                                        </div>



                                    </div>
                                    <button id="update_but" type="submit" class="btn btn-dark btn-lg">עדכן סטודנט</button>
                                    <p></p>

                                    <button id="close_but" type="button" class="btn btn-lg btn-danger" data-dismiss="modal">סגור</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

            </div>
        );
    }

}

export default Project_Dashboard;