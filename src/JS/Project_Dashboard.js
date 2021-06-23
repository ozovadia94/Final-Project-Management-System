import React, { Component } from 'react';
import firebase from '../Firebase/Firebase'
import MyTitle from '../Titles/Title'

import alerts from './Alerts'
import '../CSS/Pages.css' /* CSS */

import Pro_Add_Edit from './Project_AddEdit_Function'

import * as XLSX from "xlsx";

var myerror = "שגיאה בהצגת נתונים בשל אחת מהסיבות הבאות: \n1. כתובת גיט לא חוקית/לא קיימת. \n2. גיט פרטי ולכן צריך לשתף עם המשתמש projectmanager20. \n3. המערכת מחשבת כרגע את הנתונים. \n"
var my_underfined = undefined

class Project_Dashboard extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        icon_error: '',
        file: '',
        results: '',
        excel_example: '',
    }


    getIcons = async () => {
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

        firebase.storage().ref("images/").child('icons8-error-36.png').getDownloadURL().then((url) => {
            this.setState({ icon_error: url })
        }).catch((error) => console.log(error))

        firebase.storage().ref().child('אקסל לדוגמא.xlsx').getDownloadURL().then((url) => {
            this.setState({ excel_example: url })
        }).catch((error) => console.log(error))



    }

    get_data = async () => {
        await this.getIcons()
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
        // database_pro.get().then((snapshot)=>{


        //     console.log(snapshot.val())
        // })
        database_pro.on('value', (snapshot) => {
            for (let key = 0; key < this.state.users.length; key++) {
                var cur = document.getElementById('tr_' + key)
                if (cur !== null)
                    cur.remove()
            }

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
            for (let key in fetchedUsers) {
                if (fetchedUsers[key].stats !== undefined) {
                    for (let key2 in fetchedUsers[key].stats)
                        if (fetchedUsers[key].stats[key2] !== undefined && fetchedUsers[key].stats[key2] !== 0 && fetchedUsers[key].stats[key2]['gitdate']) {
                            var gitdate = fetchedUsers[key].stats[key2]['gitdate']
                            var str = ''
                            var ind = 0
                            for (let i = 0; i < gitdate.length; i++) {
                                if (gitdate[i] === 'T') {
                                    str = gitdate.substring(ind, i) + str
                                    break
                                }

                                if (gitdate[i] === '-') {
                                    str = '/' + gitdate.substring(ind, i) + str
                                    ind = i + 1
                                }
                            }
                            fetchedUsers[key].stats[key2]['date'] = str


                        }
                    if (fetchedUsers[key]['stats'] === undefined)
                        fetchedUsers[key]['stats'] = { 0: 0, 1: 0 }

                }
                else {
                    var st = { 0: 0, 1: 0 }
                    fetchedUsers[key]['stats'] = st
                }


                if (fetchedUsers[key].gits !== undefined)
                    fetchedUsers[key]['numOfGits'] = fetchedUsers[key].gits.length

                if (fetchedUsers[key].members !== undefined)
                    fetchedUsers[key]['partners'] = fetchedUsers[key].members.length



            }

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
        window.open('/Git_Commit?git=' + user.gits[key], 'MyWindow', 'toolbar=no,location=no,directories=no,status=no, menubar=no,scrollbars=no,resizable=no,width=900,height=600')
    }

    studentclick_git = (user, key) => {
        window.open('https://github.com/' + user.gits[key], 'MyWindow', 'toolbar=no,location=no,directories=no,status=no, menubar=no,scrollbars=no,resizable=no')
    }

    studentclick_diary = (day) => {
        window.open(day, 'MyWindow', 'toolbar=no,location=no,directories=no,status=no, menubar=no,scrollbars=no,resizable=no')
    }

    myEdit = (user) => {
        var year = document.getElementById("project_year");
        year.value = user.year
        var project_name = document.getElementById("project_name");
        project_name.value = user.project_name
        var numberOfmembers = document.getElementById("members");
        numberOfmembers.value = user.members.length

        var numberOfGits = document.getElementById("numOfgits");
        numberOfGits.value = user.gits.length


        var moderator_f = document.getElementById("moderator_f");
        moderator_f.value = user.moderator_id

        if (user.diary !== undefined) {
            var student_diary = document.getElementById("diary");
            student_diary.value = user.diary
        }

        Pro_Add_Edit.addFieldsMembers()
        Pro_Add_Edit.addFieldsGits()


        let num;
        for (let i = 0; i < numberOfmembers.value; i++) {
            num = i + 1
            document.getElementById("student_id" + num).value = user.members[i].id
            document.getElementById("student_email" + num).value = user.members[i].email
            document.getElementById("student_name" + num).value = user.members[i].name
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
        this.setState({ file: '' })
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
        var process_log = ''

        for (let key = 0; key < projects.length - 1; key++) {
            await this.add_project2(projects[key], key)
            let hand = await this.handleSubmit2(key)
            console.log(hand)
            if (typeof hand === 'string') {
                process_log += hand + '\n'
            }
            else if (hand !== undefined) {
                let db_req = await this.add_to_database(hand, key)
                if (db_req !== undefined)
                    process_log += db_req;
                console.log(db_req)
            }

        }
        function download(filename, text) {
            var pom = document.createElement('a');
            pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            pom.setAttribute('download', filename);
            document.body.appendChild(pom);
            pom.click();
            document.body.removeChild(pom);
        }

        download("log.txt", process_log)
    }

    add_to_database = async (user, key) => {
        var projID = firebase.database().ref().child('projects/').push().key;
        var x = firebase.database().ref('projects/' + projID).set(user)
            .then((x) => {
                console.log('Succed')
                return "שורה " + (parseInt(key) + 2) + ':  נוספה בהצלחה'
            }).catch((err) => {
                return "שורה " + (parseInt(key) + 2) + ':  עדכון במסד נתונים נכשל'
            });
        return x
    }

    add_project = async (project) => {
        console.log(project)

        const user = {
            year: '',
            project_name: '',
            diary: '',
            moderator_id: '',
            members: [],
            gits: [],

        }
        user.members[0] = { id: '', name: '', email: '' }

        if (project.student_id1 !== undefined && project.student_name1 !== undefined && project.student_email1 !== undefined && project.student_id1 !== '' && project.student_name1 !== '' && project.student_email1 !== '') {
            user.members[0].id = project.student_id1
            user.members[0].name = project.student_name1
            user.members[0].email = project.student_email1
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


        if (typeof project.diary !== undefined)
            user.diary = project.diary
        if (typeof project.git1 !== undefined)
            user.gits[0] = project.git1
        if (typeof project.numOfGits !== undefined && project.numOfGits === '2') {
            if (typeof project.git2 !== undefined)
                user.gits[1] = project.git2
        }

        if (typeof project.project_name !== undefined && project.name !== '' && typeof project.year !== undefined && project.year !== '') {
            user.name = project.project_name
            user.year = project.year
            user.moderator_id = 'Not selected'
            if (typeof project.project_supervisor_email !== undefined) {
                for (let i in this.state.moderators) {
                    if (project.project_supervisor_email === this.state.moderators[i].email) {
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

    add_project2 = async (project, key) => {
        if (project === undefined || project === null)
            return;
        if (project.year !== undefined)
            document.getElementById('project_year').value = project.year

        if (project.project_name !== undefined)
            document.getElementById('project_name').value = project.project_name

        // members
        document.getElementById('moderator_f').value = 'Not selected'
        if (project.project_supervisor_email !== undefined) {
            for (let key in this.state.moderators) {
                if (this.state.moderators[key].email === project.project_supervisor_email) {
                    document.getElementById('moderator_f').value = this.state.moderators[key].id
                    break;
                }
            }
        }

        if (project.student_id1 !== undefined && project.student_name1 !== undefined && project.student_email1 !== undefined) {
            document.getElementById('student_id1').value = project.student_id1
            document.getElementById('student_name1').value = project.student_name1
            document.getElementById('student_email1').value = project.student_email1
        }


        if (project.student_id2 !== undefined && project.student_name2 !== undefined && project.student_email2 !== undefined) {
            document.getElementById('student_id2').value = project.student_id2
            document.getElementById('student_name2').value = project.student_name2
            document.getElementById('student_email2').value = project.student_email2
        }

        if (project.diary !== undefined) {
            document.getElementById('diary').value = project.diary
        }

        if (project.git1 !== undefined) {
            document.getElementById('git_id1').value = project.git1
        }
        if (project.git2 !== undefined) {
            document.getElementById('git_id2').value = project.git2
        }
        return;
    }

    do_nothing = () => {
        return
    }

    async handleSubmit(e) {
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
                id: document.getElementById("student_id" + num).value,
                name: document.getElementById("student_name" + num).value,
                email: document.getElementById("student_email" + num).value,
            }
        }

        // for(let key in this.state.users){
        //     cur=this.state.users[key].members
        //     console.log(members)
        // }


        await Pro_Add_Edit.check_if_user_exist(this.state.users, members, this.input_year.value, true, this.state.edit)
            .then((x) => {
                if (x !== undefined) {
                    alert(x)
                    e.preventDefault();
                    return
                }

                var stats;
                if (gits.length === 1)
                    stats = { 0: 0 }
                else {
                    stats = { 0: 0, 1: 0 }
                }

                var ref = this.state.edit
                if (ref === '')
                    ref = firebase.database().ref().child('projects').push().key;;

                var updates = {};
                updates['/projects/' + ref + '/project_name'] = this.input.value
                updates['/projects/' + ref + '/diary'] = this.input5.value
                updates['/projects/' + ref + '/moderator_id'] = mod.value
                updates['/projects/' + ref + '/members'] = members
                updates['/projects/' + ref + '/gits'] = gits
                updates['/projects/' + ref + '/date'] = []
                updates['/projects/' + ref + '/year'] = this.input_year.value
                updates['/projects/' + ref + '/stats'] = stats

                firebase.database().ref().update(updates).then((x) => {
                    alerts.alert('פרוייקט עודכן')//true for refresh!
                }).catch((err) => {
                    console.log(err)
                });
                e.preventDefault();

                document.getElementById('close_but').click()


            })


    }

    handleSubmit2 = async (key) => {
        var error_st = ''

        let gits = []
        let git1 = document.getElementById("git_id1").value
        let git2 = document.getElementById("git_id2").value
        if (git1 === '')
            gits[0] = ''
        else
            gits[0] = git1

        if (git2 !== '')
            gits[1] = git2

        var diary = document.getElementById("diary").value

        var year = document.getElementById("project_year").value
        if (year === '')
            error_st += '| year'

        var project_name = document.getElementById("project_name").value
        if (project_name === '')
            error_st += '| project_name'

        var moder = document.getElementById("moderator_f").value


        let members = []
        var id = document.getElementById("student_id1").value
        var name = document.getElementById("student_name1").value
        var email = document.getElementById("student_email1").value
        if (id === '')
            error_st += '| student_id1'
        if (name === '')
            error_st += '| student_name1'
        if (email === '') {
            error_st += '| student_email1'
        }
        members[0] = {
            id: id,
            name: name,
            email: email,
        }


        id = document.getElementById("student_id2").value
        name = document.getElementById("student_name2").value
        email = document.getElementById("student_email2").value
        var err_2 = ''
        if (id === '')
            err_2 += '| student_id2'
        if (name === '')
            err_2 += '| student_name2'
        if (email === '') {
            err_2 += '| student_email2'
        }

        if (id !== '' && name !== '' && email !== '') {
            members[1] = {
                id: id,
                name: name,
                email: email,
            }
        }
        else
            error_st += err_2

        // for (let k = 0; k < numOfPartners.value; k++) {
        //     let num = k + 1
        //     members[k] = {
        //         id: document.getElementById("member_id" + num).value,
        //         name: document.getElementById("member_name" + num).value,
        //         email: document.getElementById("member_email" + num).value,
        //     }
        // }


        var stats;
        if (gits.length === 1)
            stats = { 0: 0 }
        else {
            stats = { 0: 0, 1: 0 }
        }

        const user = {
            year: year,
            project_name: project_name,
            diary: diary,
            moderator_id: moder,
            members: members,
            gits: gits,
            stats: stats
        }

        document.getElementById("show2").reset();

        let ret = await Pro_Add_Edit.check_if_user_exist(this.state.users, members, year)
            .then((x) => {
                if (x !== undefined) {
                    error_st += x
                }
                if (error_st !== '') {
                    error_st = "שורה " + (parseInt(key) + 2) + '  שגיאה\t' + error_st
                    // console.log(error_st)
                    return error_st
                }
                else
                    return user
            })
        return ret

    }



    render() {
        return (
            <div className='ozbackground spec' >

                <MyTitle title="לוח פרוייקטים" />

                {this.state.loading ? (<div>
                    <div className='ozbackground'>

                        <select onChange={() => this.select_filter()} id="my_mod" type='text' name="mods" class="form-control-lg text-right" dir='rtl'>
                            <option value='0'>כל המנחים</option>
                            {this.state.moderators.map((mod) => (
                                <option value={mod.id}>{mod.name}</option>

                            ))}
                        </select>

                        <select onChange={() => this.select_filter()} id="my_years" type='text' name="years" class="form-control-lg text-right" dir='rtl'>
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
                                        <td width="10%">{user.project_name}</td>
                                        {user.partners === 1 ? (<td>יחיד</td>) : (<td>זוגי</td>)}

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


                                        <td width="10%" id={'td_mod_' + index} >{user.mod_name}</td>

                                        {user.diary !== my_underfined && user.diary === '' ? (<td></td>) : (<td><img id={'day_id_' + index} class='mypointer' alt='diary' onClick={() => this.studentclick_diary(user.diary)} src={this.state.icon_diary} ></img> </td>
                                        )}


                                        {user.stats[0] !== my_underfined && user.stats[0] !== -1 && user.stats[0] !== 0 ?
                                            (
                                                <td><img src={this.state.icon_github} class='mypointer' onClick={() => this.studentclick_git(user, 0)} alt='github address'></img>

                                                    {user.stats[1] !== -1 && user.stats[1] !== 0 ?
                                                        (<div><p /> <br /> <img src={this.state.icon_github} class='mypointer' onClick={() => this.studentclick_git(user, 1)} alt='github address'></img></div>)
                                                        : (this.do_nothing())}
                                                    {user.stats[1] === -1 ?
                                                        (<div><p /> <br /> <img src={this.state.icon_error} title={myerror} alt='github_Error'></img></div>)
                                                        : (this.do_nothing())}
                                                </td>
                                            )
                                            : (this.do_nothing())}
                                        {user.stats[0] !== my_underfined && user.stats[0] === -1 ?
                                            (
                                                <td><img src={this.state.icon_error} title={myerror} alt='github_Error'></img>
                                                    <p></p>
                                                    {user.stats[1] !== -1 && user.stats[1] !== 0 ?
                                                        (<div><p /> <br /> <img src={this.state.icon_github} class='mypointer' onClick={() => this.studentclick_git(user, 1)} alt='github address'></img></div>)
                                                        : (this.do_nothing())}
                                                    {user.stats[1] === -1 ?
                                                        (<div><p /> <br /> <img src={this.state.icon_error} title={myerror} alt='github_Error'></img></div>)
                                                        : (this.do_nothing())}
                                                </td>
                                            )
                                            : (this.do_nothing())}

                                        {user.stats[0] === 0 ? (<td></td>) : (this.do_nothing())}



                                        {user.stats[0] !== my_underfined && user.stats[0] !== -1 && user.stats[0] !== 0 ?
                                            (
                                                <td>{user.stats[0].date}
                                                    <p></p>
                                                    {user.stats[1] && user.stats[1] !== -1 && user.stats[1] !== 0 ?
                                                        (<div><p /> <br /> {user.stats[1].date}</div>)
                                                        : (this.do_nothing())}
                                                    {user.stats[1] === -1 ?
                                                        (<div><p /> <br /> </div>)
                                                        : (this.do_nothing())}
                                                </td>
                                            )
                                            : (this.do_nothing())}
                                        {user.stats[0] !== my_underfined && user.stats[0] === -1 ?
                                            (
                                                <td><div><p /><br /></div>
                                                    <p></p>
                                                    {user.stats[1] !== -1 && user.stats[1] !== 0 ?
                                                        (<div><p /> <br /> {user.stats[1].date}</div>)
                                                        : (this.do_nothing())}
                                                    {user.stats[1] === -1 ?
                                                        (<div><p /> <br /> </div>)
                                                        : (this.do_nothing())}
                                                </td>
                                            )
                                            : (this.do_nothing())}
                                        {user.stats[0] === 0 ? (<td></td>) : (this.do_nothing())}

                                        {user.stats[0] !== my_underfined && user.stats[0] !== -1 && user.stats[0] !== 0 ?
                                            (
                                                <td>{user.stats[0].Number_of_commits}
                                                    <p></p>
                                                    {user.stats[1] && user.stats[1] !== -1 && user.stats[1] !== 0 ?
                                                        (<div><p /> <br /> {user.stats[1].Number_of_commits}</div>)
                                                        : (this.do_nothing())}
                                                    {user.stats[1] === -1 ?
                                                        (<div><p /> <br /> </div>)
                                                        : (this.do_nothing())}
                                                </td>
                                            )
                                            : (this.do_nothing())}
                                        {user.stats[0] !== my_underfined && user.stats[0] === -1 ?
                                            (
                                                <td><div><p /><br /></div>
                                                    <p></p>
                                                    {user.stats[1] && user.stats[1] !== -1 && user.stats[1] !== 0 ?
                                                        (<div><p /> <br /> {user.stats[1].Number_of_commits}</div>)
                                                        : (this.do_nothing())}
                                                    {user.stats[1] === -1 ?
                                                        (<div><p /> <br /> </div>)
                                                        : (this.do_nothing())}
                                                </td>
                                            )
                                            : (this.do_nothing())}
                                        {user.stats[0] === 0 ? (<td></td>) : (this.do_nothing())}


                                        {user.stats[0] !== my_underfined && user.stats[0] !== -1 && user.stats[0] !== 0 ?
                                            (
                                                <td>{user.stats[0].median_File}
                                                    <p></p>
                                                    {user.stats[1] !== my_underfined && user.stats[1] !== -1 && user.stats[1] !== 0 ?
                                                        (<div><p /> <br /> {user.stats[1].median_File}</div>)
                                                        : (this.do_nothing())}
                                                    {user.stats[1] === -1 ?
                                                        (<div><p /> <br /> </div>)
                                                        : (this.do_nothing())}
                                                </td>
                                            )
                                            : (this.do_nothing())}
                                        {user.stats[0] !== my_underfined && user.stats[0] === -1 ?
                                            (
                                                <td><div><p /><br /></div>
                                                    <p></p>
                                                    {user.stats[1] !== -1 && user.stats[1] !== 0 ?
                                                        (<div><p /> <br /> {user.stats[1].median_File}</div>)
                                                        : (this.do_nothing())}
                                                    {user.stats[1] === -1 ?
                                                        (<div><p /> <br /> </div>)
                                                        : (this.do_nothing())}
                                                </td>
                                            )
                                            : (this.do_nothing())}
                                        {user.stats[0] === 0 ? (<td></td>) : (this.do_nothing())}


                                        {user.stats[0] !== my_underfined && user.stats[0] !== -1 && user.stats[0] !== 0 ?
                                            (
                                                <td>{user.stats[0].median_Total}
                                                    <p></p>
                                                    {user.stats[1] !== my_underfined && user.stats[1] !== -1 && user.stats[1] !== 0 ?
                                                        (<div><p /> <br /> {user.stats[1].median_Total}</div>)
                                                        : (this.do_nothing())}
                                                    {user.stats[1] === -1 ?
                                                        (<div><p /> <br /> </div>)
                                                        : (this.do_nothing())}
                                                </td>
                                            )
                                            : (this.do_nothing())}
                                        {user.stats[0] !== my_underfined && user.stats[0] === -1 ?
                                            (
                                                <td><div><p /><br /></div>
                                                    <p></p>
                                                    {user.stats[1] !== my_underfined && user.stats[1] !== -1 && user.stats[1] !== 0 ?
                                                        (<div><p /> <br /> {user.stats[1].median_Total}</div>)
                                                        : (this.do_nothing())}
                                                    {user.stats[1] === -1 ?
                                                        (<div><p /> <br /> </div>)
                                                        : (this.do_nothing())}
                                                </td>
                                            )
                                            : (this.do_nothing())}
                                        {user.stats[0] === 0 ? (<td></td>) : (this.do_nothing())}

                                        {user.stats[0] && user.stats[0] !== -1 && user.stats[0] !== 0 ?
                                            (
                                                <td><a href="/" onClick={() => this.studentclick(user, 0)} class="btn btn-outline-warning buttLink Logged-out" data-toggle="modal">התקדמות בגיט</a>
                                                    <p></p>
                                                    {user.stats[1] !== my_underfined && user.stats[1] !== -1 && user.stats[1] !== 0 ?
                                                        (<div><p /> <br /> <a href="/" onClick={() => this.studentclick(user, 1)} class="btn btn-outline-warning buttLink Logged-out" data-toggle="modal">התקדמות בגיט</a></div>)
                                                        : (this.do_nothing())}
                                                    {user.stats[1] === -1 ?
                                                        (<div><p /> <br /> </div>)
                                                        : (this.do_nothing())}
                                                </td>
                                            )
                                            : (this.do_nothing())}
                                        {user.stats[0] && user.stats[0] === -1 ?
                                            (
                                                <td><div><p /><br /></div>
                                                    <p></p>
                                                    {user.stats[1] !== my_underfined && user.stats[1] !== -1 && user.stats[1] !== 0 ?
                                                        (<div><p /> <br /> <a href="/" onClick={() => this.studentclick(user, 1)} class="btn btn-outline-warning buttLink Logged-out" data-toggle="modal">התקדמות בגיט</a></div>)
                                                        : (this.do_nothing())}
                                                    {user.stats[1] === -1 ?
                                                        (<div><p /> <br /> </div>)
                                                        : (this.do_nothing())}
                                                </td>
                                            )
                                            : (this.do_nothing())}
                                        {user.stats[0] === 0 ? (<td></td>) : (this.do_nothing())}


                                        <td>
                                            <img src={this.state.icon_edit} class='mypointer Logged-out' href="#home" onClick={() => {
                                                this.myEdit(user)

                                            }} data-toggle="modal" data-target="#modalLRForm" alt='edit_Button'></img>
                                        </td>

                                        <td><img src={this.state.icon_delete} class='mypointer' onClick={() => this.deleteUserId(user.id)} alt='delete_Button'></img></td>


                                    </tr>


                                ))}


                            </tbody>
                        </table>
                    </div>


                    <div class="" dir='rtl'>
                        <input className='btn btn-secondary btn-sm hide_file' id="file" type="file" ref="fileUploader" onChange={this.filePathset.bind(this)} />
                        <button class="btn btn-secondary" onClick={() => { this.readFile(); }}>טען קובץ</button>
                        <button class="btn btn-secondary" onClick={() => this.removeFile()}>בטל בחירה</button>
                        <a class="btn btn-dark" href={this.state.excel_example}>הורד קובץ לדוגמא</a>

                    </div>

                </div>) :
                    (<div></div>)
                }


                < div className="col-md-6" >

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
                                            <select id="moderator_f" type='text' class="form-control form-control-lg text-right" dir='rtl'>
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
                                                    <input type="number" id="student_id1" class="form-control form-control-lg text-right" placeholder="תעודת זהות" required></input>
                                                    <input type="text" id="student_name1" class="form-control form-control-lg text-right" placeholder="שם" required></input>
                                                    <input type="email" id="student_email1" class="form-control form-control-lg text-right" placeholder="example@example.com" required></input>
                                                </div>
                                            </div>

                                            <div id='member2_form' className='nonethings'>סטודנט 2
                                                <br />
                                                <input type="number" id="student_id2" class="form-control form-control-lg text-right" placeholder="תעודת זהות" required=""></input>
                                                <input type="text" id="student_name2" class="form-control form-control-lg text-right" placeholder="שם" required=""></input>
                                                <input type="email" id="student_email2" class="form-control form-control-lg text-right" placeholder="example@example.com" required=""></input>
                                                <br />
                                            </div>

                                            <p></p><p></p><p></p>

                                            <p></p>
                                            <input id='diary' type="text" class="form-control form-control-lg text-right" placeholder="כתובת יומן" ref={(input5) => this.input5 = input5}></input>
                                            <p></p>

                                            <select id="numOfgits" type="text" name="gits" class="form-control form-control-lg text-right" dir='rtl' onChange={Pro_Add_Edit.addFieldsGits}>
                                                <option selected="selected" value='1'>1</option>
                                                <option value='2'>2</option>
                                            </select>
                                            <div class="form-group" id="containerGit">
                                                <input id="git_id1" type="text" class="form-control form-control-lg text-right" placeholder="git_user/repository" ></input>
                                                <div id='git2_form' className='nonethings'>
                                                    <input id="git_id2" type="text" class="form-control form-control-lg text-right" placeholder="git_user/repository" />
                                                </div>
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
                </div >




            </div >
        );
    }

}

export default Project_Dashboard;