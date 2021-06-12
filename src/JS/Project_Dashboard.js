import React, { Component } from 'react';
import firebase from '../Firebase/Firebase'
import MyTitle from '../Titles/Title'

import alerts from './Alerts'
import '../CSS/Pages.css' /* CSS */

import Pro_Add_Edit from './Project_AddEdit_Function'

import * as XLSX from "xlsx";

class Project_Dashboard extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getIcons()
    }

    state = {
        moderators: [],
        users: [],
        moder_res: [],
        all_years: [],
        edit: '',
        loading: false,
        selectedUserId: null,
        show: false,
        icon_github: '',
        icon_diary: '',
        icon_edit: '',
        icon_delete: '',
        file: '',
        results: '',
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
        await this.get_moderators(projs);
        this.setState({ loading: true })
        //var yea = await this.get_years(vals[1])
    }


    get_years = async (uniq) => {
        var my_years = document.getElementById('my_years')//.innerHTML
        var add;

        for (let key in uniq) {
            add = document.createElement("option");
            add.value = uniq[key]
            add.innerHTML = uniq[key]
            my_years.appendChild(add)
        }
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
                var cur = fetchedUsers[key].moderator_id
                if (cur !== 'Not selected' && res[cur] !== undefined && res[cur].name !== undefined)
                    fetchedUsers[key]['mod_name'] = res[cur].name
                else
                    fetchedUsers[key]['mod_name'] = 'לא נבחר מנחה!'

            }
            this.setState({ moderators: fetched, moder_res: res, users: fetchedUsers });
        })
    }

    componentDidMount() {
        Pro_Add_Edit.generateArrayOfYears()
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

        Pro_Add_Edit.addFieldsMembers()
        Pro_Add_Edit.addFieldsGits()


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
                if (dir === "asc") {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        //if so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir === "desc") {
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
                if (switchcount === 0 && dir === "asc") {
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

    filePathset = (e) => {
        e.stopPropagation();
        e.preventDefault();
        var file = e.target.files[0];
        // console.log(file);
        this.setState({ file });
    }

    readFile = async () => {
        if (this.state.file !== '') {
            var f = this.state.file;
            // console.log(f)
            // var name = f.name;
            const reader = new FileReader();
            reader.onload = async (evt) => {
                // evt = on_file_select event
                /* Parse data */
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: "binary" });
                /* Get first worksheet */
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                /* Convert array of arrays */
                const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });

                /* Update state */
                //console.log("Data>>>" + data);// shows that excel data is read
                this.add_projects_from_file(JSON.parse(this.convertToJson(data)))
                await this.removeFile()
            };

            reader.readAsBinaryString(f);


        }

    }

    removeFile = () => {
        var f = document.getElementById('file')
        f.value = ''
        this.state.file = ''

    }

    convertToJson = (csv) => {
        var lines = csv.split("\n");

        var result = [];

        var headers = lines[0].split(",");

        for (var i = 1; i < lines.length; i++) {
            var obj = {};
            var currentline = lines[i].split(",");

            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
            }

            result.push(obj);
        }

        //return result; //JavaScript object
        return JSON.stringify(result); //JSON
    }

    add_projects_from_file = async (projects) => {
        for (let key in projects) {
            var cur = await this.add_project(projects[key]).then(user => {
                if (user !== undefined) {
                    var projID = firebase.database().ref().child('projects/').push().key;

                    firebase.database().ref('projects/' + projID).set(user)
                        .then((x) => {
                            console.log('Succed')
                        }).catch((err) => {
                            console.log('Failed')
                        });
                }
            })

        }
        alerts.alert('פרוייקטים נוספו')
    }
    add_project = async (project) => {
        const user = {
            year: '',
            name: '',
            partners: 1,
            daybook: '',
            moderator_id: '',
            members: [],
            numOfGits: 1,
            gits: [],

        }
        user.members[0] = { id: '', name: '', email: '' }
        if (typeof project.student1_id !== undefined && typeof project.student1_name !== undefined && typeof project.student1_mail !== undefined && project.student1_id !== '' && project.student1_name !== '' && project.student1_mail !== '') {
            user.members[0].id = project.student1_id
            user.members[0].name = project.student1_name
            user.members[0].email = project.student1_mail
        }
        else {
            return
        }

        if (typeof project.partners !== undefined && project.partners === '2') {
            user.partners = project.partners
            user.members[1] = { id: '', name: '', email: '' }
            if (typeof project.student2_id !== undefined)
                user.members[1].id = project.student2_id
            if (typeof project.student2_name !== undefined)
                user.members[1].name = project.student2_name
            if (typeof project.student2_mail !== undefined)
                user.members[1].email = project.student2_mail
        }


        if (typeof project.daybook !== undefined)
            user.daybook = project.daybook
        if (typeof project.git1 !== undefined)
            user.gits[0] = project.git1
        if (typeof project.numOfGits !== undefined && project.partners === '2') {
            user.numOfGits = project.numOfGits
            if (typeof project.git2 !== undefined)
                user.gits[1] = project.git2
        }

        if (typeof project.name !== undefined && project.name != '' && typeof project.year !== undefined && project.year != '') {
            user.name = project.name
            user.year = project.year
            user.moderator_id = 'Not selected'
            if (typeof project.moderator_mail !== undefined) {
                for (let i in this.state.moderators) {
                    if (project.moderator_mail == this.state.moderators[i].email) {
                        user.moderator_id = this.state.moderators[i].id
                        break;
                    }

                }
            }
        }
        else {
            return;
        }
        return user

    }

    render() {
        return (
            <div className='ozbackground spec'>

                <MyTitle title="לוח פרוייקטים" />

                {this.state.loading ? (<div>
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
                                    <th width="10%" class="th-sm mypointer" scope="col" onClick={() => { this.sortTable(1) }} >שם הפרוייקט</th>
                                    <th class="th-sm mypointer" scope="col" onClick={() => { this.sortTable(2) }} >שותפים</th>

                                    <th class="th-sm mypointer" scope="col" onClick={() => { this.sortTable(3) }} >ת.ז</th>
                                    <th class="th-sm mypointer" scope="col" onClick={() => { this.sortTable(4) }} >שמות</th>

                                    <th class="th-sm mypointer" scope="col" onClick={() => { this.sortTable(5) }} >אימיילים</th>
                                    <th width="10%" class="th-sm mypointer" scope="col" onClick={() => { this.sortTable(6) }} >מנחה</th>

                                    <th class="th-sm" scope="col">יומן</th>
                                    <th class="th-sm" scope="col">גיט</th>

                                    <th width="1%" class="th-sm" scope="col">קומיט אחרון</th>
                                    <th width="1%" class="th-sm" scope="col">מספר קומיטים</th>
                                    <th width="1%" class="th-sm" scope="col">חציון קבצים</th>
                                    <th width="1%" class="th-sm" scope="col">חציון שורות</th>
                                    <th class="th-sm" scope="col">מצב התקדמות בגיט</th>

                                    <th class="th-sm" scope="col">עריכה</th>
                                    <th class="th-sm" scope="col">מחיקה</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.users.map((user, index) => (




                                    <tr id={'tr_' + index}>
                                        <td id={'td_year_' + index}>{user.year}</td>
                                        <td width="10%">{user.name}</td>
                                        {user.partners==1?(<td>יחיד</td>):(<td>זוגי</td>)}



                                        <td>
                                            <div>{user.members[0].id}</div>
                                            {user.members[1] ? (<div>{user.members[1].id}</div>) : (<div></div>)}
                                        </td>

                                        <td><div>{user.members[0].name}</div>
                                        {user.members[1] ? (<div>{user.members[1].name}</div>) : (<div></div>)}
                                        </td>
                                        <td><div>{user.members[0].email}</div>
                                        {user.members[1] ? (<div>{user.members[1].email}</div>) : (<div></div>)}
                                        </td>
                                        {/* {user.members[1] ? (
                                            <tr>
                                                <td>{user.members[1].id}</td>
                                                <td>{user.members[1].name}</td>
                                                <td>{user.members[1].email}</td>
                                            </tr>
                                        ) : (<div></div>)} */}





                                        <td width="10%" id={'td_mod_' + index} >{user.mod_name}</td>

                                        {user.daybook === '' ? (<td></td>) : (<td><img id={'day_id_' + index} class='mypointer' alt='diary' onClick={() => this.studentclick_daybook(user.daybook)} src={this.state.icon_diary} ></img> </td>
                                        )}

                                        <td><a class='mypointer' onClick={() => this.studentclick_git(user, 0)} alt='github address'><img src={this.state.icon_github} id='gitimg' /></a>
                                            {user.numOfGits > 1 ?
                                                (<div>
                                                    <p></p>
                                                    <a class='mypointer' onClick={() => this.studentclick_git(user, 1)} data-toggle="modal" alt='github address'><img src={this.state.icon_github} id='gitimg' /></a></div>) : (<div></div>)}
                                        </td>


                                        <td>{user.stats && user.stats[0] ?
                                            (<div>{user.stats[0].date}
                                                {user.stats[1] ? (<div><p></p> {user.stats[1].date}</div>) : (<div></div>)}
                                            </div>)
                                            :
                                            (<div>שגיאה!</div>)}
                                        </td>

                                        <td>{user.stats && user.stats[0] ?
                                            (<div>{user.stats[0].Number_of_commits}
                                                {user.stats[1] ? (<div><p></p> {user.stats[1].Number_of_commits}</div>) : (<div></div>)}
                                            </div>)
                                            :
                                            (<div>שגיאה!</div>)}
                                        </td>

                                        <td>{user.stats && user.stats[0] ?
                                            (<div>{user.stats[0].median_File}
                                                {user.stats[1] ? (<div><p></p> {user.stats[1].median_File}</div>) : (<div></div>)}
                                            </div>)
                                            :
                                            (<div>שגיאה!</div>)}
                                        </td>

                                        <td>{user.stats && user.stats[0] ?
                                            (<div>{user.stats[0].median_Total}
                                                {user.stats[1] ? (<div><p></p> {user.stats[1].median_Total}</div>) : (<div></div>)}
                                            </div>)
                                            :
                                            (<div>שגיאה!</div>)}
                                        </td>

                                        <td><a href="/" onClick={() => this.studentclick(user, 0)} class="btn btn-outline-warning buttLink Logged-out" data-toggle="modal">התקדמות בגיט</a>
                                            {user.numOfGits > 1 ? (<div><p></p> <a href="/" onClick={() => this.studentclick(user, 1)} class="btn btn-outline-warning buttLink Logged-out" data-toggle="modal">התקדמות בגיט</a></div>) : (<div></div>)}
                                        </td>



                                        <td>
                                            <a href="#home" onClick={() => {
                                                this.myEdit(user)

                                            }} class="Logged-out" data-toggle="modal" data-target="#modalLRForm" alt='edit Buttun'><img src={this.state.icon_edit} /></a>
                                        </td>

                                        <td><a class='mypointer' onClick={() => this.deleteUserId(user.id)} alt='delete Buttun'><img src={this.state.icon_delete} /></a></td>


                                    </tr>


                                ))}


                            </tbody>
                        </table>
                    </div>


                    <div>
                        <input id="file" type="file" ref="fileUploader" onChange={this.filePathset.bind(this)} />
                        <button onClick={() => { this.readFile(); }}>טען קובץ</button>
                        <button onClick={() => this.removeFile()}>בטל בחירה</button>
                    </div>

                </div>) :
                    (<div></div>)}







                <div className="col-md-6">

                    <form id="show2" onSubmit={this.handleSubmit} class="row justify-content-md-center">
                        <div class="modal fade" id="modalLRForm" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                            <div class="modal-dialog cascading-modal" role="document">
                                <div class="modal-content">
                                    <div class="modal-body mb-1">


                                        <div class="form-group" id='myform'>
                                            <select id="project_year" type='number' class="form-control form-control-lg text-right" dir='rtl' required placeholder="שנת הפרוייקט" ref={(year) => this.input_year = year}>
                                            </select>  <p></p>
                                            <input id='project_name' type="text" class="form-control form-control-lg text-right" required placeholder="שם הפרוייקט" ref={(input) => this.input = input}></input>
                                            <p></p>
                                            <select id="moderator_f" type='text' name="cars" class="form-control form-control-lg text-right" dir='rtl'>
                                                <option value='Not selected'>בחר מנחה מהרשימה</option>
                                                {this.state.moderators.map((mod) => (
                                                    <option value={mod.id}>{mod.name}</option>
                                                ))}
                                            </select>


                                            <p></p>
                                            <select id="members" type='text' name="partners" class="form-control form-control-lg text-right" dir='rtl' onChange={Pro_Add_Edit.addFieldsMembers}>
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

                                            <select id="numOfgits" type="text" name="gits" class="form-control form-control-lg text-right" dir='rtl' onChange={Pro_Add_Edit.addFieldsGits}>
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