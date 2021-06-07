import React, { Component } from 'react';
import firebase from '../Firebase/Firebase'
import MyTitle from '../Titles/Title'
import SecondaryTitle from '../Titles/SecondaryTitle'
import alerts from './Alerts'


import '../CSS/Pages.css' /* CSS */

class Add_Project extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    generateArrayOfYears = () => {
        var y = new Date().getFullYear()
        var min = 2018
        var max = y + 3

        var years = document.getElementById("project_year");

        for (var i = min; i < max; i++) {
            var year =  document.createElement("option");;
            year.value = i
            year.innerHTML=i
            if(i==y)
            {
                console.log('this',i)
                year.selected=' '
            }
            years.appendChild(year)
        }
    }


    componentDidMount() {
        this.generateArrayOfYears()
        var database = firebase.database().ref('moderators/');
        database.on('value', (snapshot) => {
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
        // .catch(err => {
        //     console.log('HERE!')
        //     this.setState({ loading: false });
        // })
    }

    state = {
        moderator: [],
        res_data: [],
        loading: true,
        selectedUserId: null,
    }



    handleSubmit(e) {
        var mod = document.getElementById("moderator_f");
        var numOfPartners = document.getElementById("members");
        var numOfGits = document.getElementById("numOfgits");

        //Get all the gits from the user
        let gits = []
        for (let k = 0; k < numOfGits.value; k++) {
            let num = k + 1
            gits[k] = document.getElementById("git_id" + num).value
        }

        //Get all the members from the user
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
            date: [],
            year: this.input_year.value,
        }

        // axiosFirebase.post('/projects.json', user).then(function (response) {
        // alerts.alert('פרוייקט נוסף')//true for refresh!


        // }).catch(error => {
        //     console.log(error)
        // });

        var newPostKey = firebase.database().ref().child('projects/').push().key;
        var updates = {};
        updates['/projects/' + newPostKey] = user;

        firebase.database().ref().update(updates).then((x) => {
            alerts.alert('פרוייקט נוסף')//true for refresh!
        }).catch((err) => {
            console.log('Failed')
        });

        e.preventDefault();
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

    render() {
        return (
            <div className='backgroundPage'>

                <MyTitle title="הוסף פרוייקט חדש" />

                <div id="show" class="rtt11"><SecondaryTitle title='אנא מלא את כל השדות' > </SecondaryTitle></div>

                <form id="myForm" onSubmit={this.handleSubmit} class="row justify-content-md-center" dir='rtl'>

                    <div class="col-lg-4">
                        <div class="Card bg-white text-center card-form">
                            <div class="card-body">
                                <div class="form-group" id='form1'>
                                    
                                    <select id="project_year" type='number' class="form-control form-control-lg text-right" dir='rtl' required placeholder="שנת הפרוייקט" ref={(year) => this.input_year = year}>
                                    </select>
                                    <p></p>
                                    <input type="text" class="form-control form-control-lg text-right" required placeholder="שם הפרוייקט" ref={(input) => this.input = input}></input>
                                    <p></p>
                                    <select id="moderator_f" type='text' class="form-control form-control-lg text-right" dir='rtl'>
                                        <option value='Not selected'>בחר מנחה מהרשימה</option>
                                        {this.state.moderator.map((user) => (
                                            <option value={user.id}>{user.name}</option>
                                        ))}
                                    </select>
                                    <p></p>

                                    <select id="members" type='text' name="partners" class="form-control form-control-lg text-right" dir='rtl' onChange={this.addFieldsMembers}>
                                        <option selected="selected" value='1'>פרוייקט יחיד</option>
                                        <option value='2'>פרוייקט זוגי</option>
                                    </select>

                                </div>

                                <div class="form-group" id="container">
                                    <div>
                                        סטודנט 1<br />
                                        <input type="number" id="member_id1" class="form-control form-control-lg text-right" placeholder="תעודת זהות" required></input>
                                        <input type="text" id="member_name1" class="form-control form-control-lg text-right" placeholder="שם" required></input>
                                        <input type="email" id="member_mail1" class="form-control form-control-lg text-right" placeholder="example@example.com" required></input>
                                    </div>
                                </div>




                            </div></div></div>

                    <div class="col-lg-4">
                        <div class="Card bg-white text-center card-form">
                            <div class="card-body">
                                <div class="form-group">
                                    <input id='daybook' type="text" class="form-control form-control-lg text-right" placeholder="כתובת יומן" ref={(input5) => this.input5 = input5}></input>
                                    <p></p>
                                    <select id="numOfgits" type='text' name="gits" class="form-control form-control-lg text-right" dir='rtl' onChange={this.addFieldsGits}>
                                        <option selected="selected" value='1'>מספר גיטים: 1</option>
                                        <option value='2'>מספר גיטים: 2</option>
                                    </select>

                                </div>

                                <div class="form-group" id="containerGit">
                                    <input id="git_id1" type="text" class="form-control form-control-lg text-right" placeholder="git_user/repository" ></input>
                                </div>

                                <div>
                                    <input type="submit" value="הוסף פרוייקט" className="btn btn-dark"></input>
                                </div>
                            </div>
                        </div>
                    </div>



                </form>
            </div>
        );
    }

}

export default Add_Project;