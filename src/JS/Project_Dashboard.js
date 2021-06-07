import React, { Component } from 'react';
import firebase from '../Firebase/Firebase'
import MyTitle from '../Titles/Title'

import alerts from './Alerts'
import '../CSS/Pages.css' /* CSS */

import $, { valHooks } from 'jquery';



class Project_Dashboard extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addFieldsMembers = this.addFieldsMembers.bind(this)
        this.getIcons()
    }

    state = {
        moderators: [],
        users: [],
        moder_res: [],
        all_years: [],
        edit: '',
        loading: true,
        selectedUserId: null,
        show: false,
        icon_github: '',
        icon_diary: '',
        icon_edit: '',
        icon_delete: '',
    }


    getIcons() {
        firebase.storage().ref("images/").child('icons8-github-36.png').getDownloadURL().then((url) => {
            this.setState({ icon_github: url })
        }).catch((error) => console.log(error))

        firebase.storage().ref("images/").child('icons8-calendar-36.png').getDownloadURL().then((url) => {
            this.setState({ icon_diary: url })
        }).catch((error) => console.log(error))

        firebase.storage().ref("images/").child('icons8-edit-36.png').getDownloadURL().then((url) => {
            this.setState({ icon_edit: url })
        }).catch((error) => console.log(error))

        firebase.storage().ref("images/").child('icons8-delete-24.png').getDownloadURL().then((url) => {
            this.setState({ icon_delete: url })
        }).catch((error) => console.log(error))
    }

    get_data = async () => {
        var projs = await this.get_projects()
        var moderators = await this.get_moderators(projs);
        //var yea = await this.get_years(vals[1])
    }


    get_years = async (uniq) => {
        console.log(uniq)

        var my_years = document.getElementById('my_years')//.innerHTML
        var add;

        for (let key in uniq) {
            add = document.createElement("option");
            add.value = uniq[key]
            add.innerHTML = uniq[key]
            my_years.appendChild(add)
            console.log(key)
        }


        console.log(my_years)
    }

    get_projects = async () => {
        const fetchedUsers = [];
        const years = [];
        var uniq;

        var database_pro = firebase.database().ref('projects/');
        database_pro.on('value', (snapshot) => {
            const res = snapshot.val();
            for (let key in res) {
                fetchedUsers.push({
                    ...res[key],
                    id: key
                });
                years.push(res[key].year)

            }
            uniq = years.sort().filter((v, i, a) => a.indexOf(v) === i);
            this.setState({ all_years: uniq });
        })
        return fetchedUsers;
    }

    get_moderators = async (fetchedUsers) => {
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

            for (let key in fetchedUsers) {
                if (fetchedUsers[key].moderator_id === 'Not selected')
                    fetchedUsers[key]['mod_name'] = 'לא נבחר מנחה!'
                else
                    fetchedUsers[key]['mod_name'] = res[fetchedUsers[key].moderator_id].name

            }
            this.setState({ moderators: fetched, moder_res: res, users: fetchedUsers });
        })
    }


    componentDidMount() {
        this.get_data()
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

    studentclick_git = (user, key) => {
        window.open('https://github.com/' + user.gits[key], 'MyWindow', 'toolbar=no,location=no,directories=no,status=no, menubar=no,scrollbars=no,resizable=no')
    }

    studentclick_daybook = (day) => {
        window.open(day, 'MyWindow', 'toolbar=no,location=no,directories=no,status=no, menubar=no,scrollbars=no,resizable=no')
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
        var year = document.getElementById("project_year");
        year.value = user.year
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

    sortTable = (n) => {

        var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        table = document.getElementById("myTable");
        switching = true;
        //Set the sorting direction to ascending:
        dir = "asc";
        /*Make a loop that will continue until
        no switching has been done:*/
        while (switching) {
            //start by saying: no switching is done:
            switching = false;
            rows = table.getElementsByTagName("TR");
            /*Loop through all table rows (except the
            first, which contains table headers):*/
            for (i = 1; i < rows.length - 1; i++) { //Change i=0 if you have the header th a separate table.
                //start by saying there should be no switching:
                shouldSwitch = false;
                /*Get the two elements you want to compare,
                one from current row and one from the next:*/
                x = rows[i].getElementsByTagName("TD")[n];
                y = rows[i + 1].getElementsByTagName("TD")[n];
                /*check if the two rows should switch place,
                based on the direction, asc or desc:*/
                if (dir == "asc") {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        //if so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == "desc") {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        //if so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            if (shouldSwitch) {
                /*If a switch has been marked, make the switch
                and mark that a switch has been done:*/
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                //Each time a switch is done, increase this count by 1:
                switchcount++;
            } else {
                /*If no switching has been done AND the direction is "asc",
                set the direction to "desc" and run the while loop again.*/
                if (switchcount == 0 && dir == "asc") {
                    dir = "desc";
                    switching = true;
                }
            }
        }
    }


    select_filter = () => {
        var year = document.getElementById('my_years').value
        var mod = document.getElementById('my_mod').value
        var cur_tr, cur_year, cur_mod, mod_name;
        var len = this.state.users.length

        if (mod !== '0')
            mod_name = this.state.moder_res[mod].name
        else
            mod_name = '0'

        //console.log('YEAR :', year, 'MOD: ', mod_name)

        for (let key = 0; key < len; key++) {
            cur_year = document.getElementById(('td_year_' + key)).innerText
            cur_mod = document.getElementById(('td_mod_' + key)).innerText
            cur_tr = document.getElementById(('tr_' + key))

            // console.log('cur_year :', cur_year, 'cur_mod: ', cur_mod)

            if (year === '0') {
                if ((mod_name === '0') || (cur_mod === mod_name))
                    cur_tr.className = ''
                else
                    cur_tr.className = 'nonethings'
            }
            else if (cur_year === year) {
                if ((cur_mod === mod_name) || (mod_name === '0'))
                    cur_tr.className = ''
                else
                    cur_tr.className = 'nonethings'
            }
            else//when year is not equal\
                cur_tr.className = 'nonethings'

        }
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

        // const user = {
        //     name: this.input.value,
        //     partners: numOfPartners.value,
        //     daybook: this.input5.value,
        //     moderator_id: mod.value,
        //     members: members,
        //     numOfGits: numOfGits.value,
        //     gits: gits,
        //     date: [],
        // }

        // axiosFirebase.put(`projects/` + this.state.edit + '.json', user)
        //     .then(function (response) {
        //         alerts.alert('פרוייקט עודכן')
        //     })
        //     .catch(error => console.log(error));
        // e.preventDefault();


        var updates = {};
        updates['/projects/' + this.state.edit + '/name'] = this.input.value
        updates['/projects/' + this.state.edit + '/partners'] = numOfPartners.value
        updates['/projects/' + this.state.edit + '/daybook'] = this.input5.value
        updates['/projects/' + this.state.edit + '/moderator_id'] = mod.value
        updates['/projects/' + this.state.edit + '/members'] = members
        updates['/projects/' + this.state.edit + '/numOfGits'] = numOfGits.value
        updates['/projects/' + this.state.edit + '/gits'] = gits
        updates['/projects/' + this.state.edit + '/date'] = []
        updates['/projects/' + this.state.edit + '/year'] = this.input_year.value



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

                    <select onChange={() => this.select_filter()} id="my_mod" type='text' name="mods" class=" form-control-lg text-right" dir='rtl'>
                        <option value='0'>כל המנחים</option>
                        {this.state.moderators.map((mod) => (
                            <option value={mod.id}>{mod.name}</option>

                        ))}
                    </select>

                    <select onChange={() => this.select_filter()} id="my_years" type='text' name="years" class=" form-control-lg text-right" dir='rtl'>
                        <option value='0'>כל השנים</option>
                        {this.state.all_years.map((year) => (
                            <option value={year}>{year}</option>
                        ))}
                    </select>


                    <table id='myTable' class="table table-dark table table-striped table-bordered table-sm" dir='rtl'>
                        <thead>
                            <tr>
                                <th class="th-sm mypointer" scope="col" onClick={() => { this.sortTable(0) }} >שנה</th>
                                <th class="th-sm mypointer" scope="col" onClick={() => { this.sortTable(1) }} >שם הפרוייקט</th>
                                <th class="th-sm mypointer" scope="col" onClick={() => { this.sortTable(2) }} >שותפים</th>
                                <th class="th-sm mypointer" scope="col" onClick={() => { this.sortTable(3) }} >ת.ז</th>
                                <th class="th-sm mypointer" scope="col" onClick={() => { this.sortTable(4) }} >שמות</th>
                                <th class="th-sm mypointer" scope="col" onClick={() => { this.sortTable(5) }} >אימיילים</th>
                                <th class="th-sm mypointer" scope="col" onClick={() => { this.sortTable(6) }} >מנחה</th>
                                <th class="th-sm" scope="col">יומן</th>
                                <th class="th-sm" scope="col">גיט</th>
                                <th class="th-sm" scope="col">עריכה</th>
                                <th class="th-sm" scope="col">מחיקה</th>
                                <th class="th-sm" scope="col">מצב התקדמות בגיט</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.users.map((user, index) => (


                                <tr id={'tr_' + index}>
                                    <td id={'td_year_' + index}>{user.year}</td>
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

                                    <td id={'td_mod_' + index} >{user.mod_name}</td>

                                    {user.daybook === '' ? (<td></td>) : (<td><img id={'day_id_' + index} class='mypointer' onClick={() => this.studentclick_daybook(user.daybook)} src={this.state.icon_diary} ></img> </td>
                                    )}

                                    <td><a class='mypointer' onClick={() => this.studentclick_git(user, 0)} ><img src={this.state.icon_github} id='gitimg' /></a>
                                        {user.numOfGits > 1 ?
                                            (<div>
                                                <p></p>
                                                <a class='mypointer' onClick={() => this.studentclick_git(user, 1)} data-toggle="modal"><img src={this.state.icon_github} id='gitimg' /></a></div>) : (<div></div>)}
                                    </td>

                                    <td>
                                        <a href="#home" onClick={() => {
                                            this.myEdit(user)

                                        }} class="Logged-out" data-toggle="modal" data-target="#modalLRForm"><img src={this.state.icon_edit} /></a>
                                    </td>

                                    <td><a class='mypointer' onClick={() => this.deleteUserId(user.id)}  ><img src={this.state.icon_delete} /></a></td>
                                        
                                    <td><a href="/" onClick={() => this.studentclick(user, 0)} class="btn btn-outline-warning buttLink Logged-out" data-toggle="modal">חלון התקדמות בגיט</a>
                                        {user.numOfGits > 1 ? (<div><p></p> <a href="/" onClick={() => this.studentclick(user, 1)} class="btn btn-outline-warning buttLink Logged-out" data-toggle="modal">חלון התקדמות בגיט</a></div>) : (<div></div>)}
                                    </td>

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
                                            <input id='project_year' type="number" class="form-control form-control-lg text-right" required placeholder="שנת הפרוייקט" ref={(year) => this.input_year = year}></input>
                                            <p></p>
                                            <input id='project_name' type="text" class="form-control form-control-lg text-right" required placeholder="שם הפרוייקט" ref={(input) => this.input = input}></input>
                                            <p></p>
                                            <select id="moderator_f" type='text' name="cars" class="form-control form-control-lg text-right" dir='rtl'>
                                                <option value='Not selected'>בחר מנחה מהרשימה</option>
                                                {this.state.moderators.map((mod) => (
                                                    <option value={mod.id}>{mod.name}</option>
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