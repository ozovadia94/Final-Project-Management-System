import React, { Component } from 'react';
import firebase from '../Firebase/Firebase'
import MyTitle from '../Titles/Title'

import alerts from './Alerts'
import '../CSS/Pages.css' /* CSS */

import Pro_Add_Edit from './Project_AddEdit_Function'

import * as XLSX from "xlsx";

var myerror = "שגיאה בהצגת נתונים בשל אחת מהסיבות הבאות: \n1. כתובת גיט לא חוקית/לא קיימת. \n2. גיט פרטי ולכן צריך לשתף עם המשתמש projectmanager20. \n3. המערכת מחשבת כרגע את הנתונים. \n"
var my_underfined = undefined
var green = 7
var yellow = 20


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
        icon_github_progress: '',
        file: '',
        results: '',
        excel_example: '',
        traffic: '',
        icons_traffic: [],
    }


    getIcons = async () => {
        firebase.storage().ref("images/").child('icons8-github-48.png').getDownloadURL().then((url) => {
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

        firebase.storage().ref("images/").child('icons8-error-48.png').getDownloadURL().then((url) => {
            this.setState({ icon_error: url })
        }).catch((error) => console.log(error))
        firebase.storage().ref("images/").child('icons8-github-48-progress.png').getDownloadURL().then((url) => {
            this.setState({ icon_github_progress: url })
        }).catch((error) => console.log(error))

        firebase.storage().ref().child('אקסל לדוגמא.xlsx').getDownloadURL().then((url) => {
            this.setState({ excel_example: url })
        }).catch((error) => console.log(error))


        firebase.storage().ref("traffic/").child('icons8-traffic-light-48.png').getDownloadURL().then((url) => {
            this.setState({ traffic: url })
        }).catch((error) => console.log(error))

        firebase.storage().ref("traffic/").child('icons8-green-circle-48.png').getDownloadURL().then((url) => {

            this.state.icons_traffic[0] = url
        }).catch((error) => console.log(error))
        firebase.storage().ref("traffic/").child('icons8-yellow-circle-48.png').getDownloadURL().then((url) => {
            this.state.icons_traffic[1] = url
        }).catch((error) => console.log(error))
        firebase.storage().ref("traffic/").child('icons8-red-circle-48.png').getDownloadURL().then((url) => {
            this.state.icons_traffic[2] = url
        }).catch((error) => console.log(error))
        firebase.storage().ref("traffic/").child('icons8-law-50.png').getDownloadURL().then((url) => {
            this.state.icons_traffic[3] = url
        }).catch((error) => console.log(error))




    }

    get_data = async () => {
        await this.getIcons()
        var projs = await this.get_projects()
        await this.get_moderators(projs)


        this.setState({ loading: true })

        //await this.get_years(projs)
        setTimeout(async () => {
            await this.year_choose()
            //your code to be executed after 1 second
        }, 1500);

    }

    // get_years = async () => {
    //     var my_years = document.getElementById('my_years')//.innerHTML
    //     var add;

    //     for (let key in this.state.all_years) {
    //         console.log(this.state.all_years[key])
    //         add = document.createElement("option");
    //         add.value = this.state.all_years[key]
    //         add.id = 'year_' + this.state.all_years[key]
    //         add.innerHTML = this.state.all_years[key]
    //         my_years.appendChild(add)
    //     }
    // }

    year_choose = async () => {
        var r = new Date()
        var mon = r.getMonth()
        var y = r.getFullYear()

        var year = y;
        if (mon > 8)
            year++;

        document.getElementById('my_years').value = year
        this.select_filter()
        //document.getElementById('year_' + year).selected = ' '
    }

    get_projects = async () => {
        const fetchedUsers = [];
        const years = [];
        var uniq;

        var database_pro = firebase.database().ref('projects/');
        database_pro.get().then(async (snapshot) => {
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
                if (fetchedUsers[key].gits !== undefined)
                    fetchedUsers[key]['numOfGits'] = fetchedUsers[key].gits.length

                if (fetchedUsers[key].members !== undefined)
                    fetchedUsers[key]['partners'] = fetchedUsers[key].members.length
            }
        })
        this.setState({ users: fetchedUsers })
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

            this.setState({ moderators: fetched, moder_res: res });
        })


        return fetchedUsers
    }

    async componentDidMount() {
        await Pro_Add_Edit.generateArrayOfYears().then(arr => {

        })

        await this.get_data()
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

    sortTable = (n, myT = true) => {
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
                var x_in = x.innerHTML.toLowerCase()
                var y_in = y.innerHTML.toLowerCase()
                // if(myT==='light')
                // {
                //     x_in=x.childNodes
                //     y_in=y.value
                // }

                if (dir === "asc") {
                    if (x_in > y_in) {
                        //if so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir === "desc") {
                    if (x_in < y_in) {
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
            //console.log(hand)
            if (typeof hand === 'string') {
                process_log += hand + '\n'
            }
            else if (hand !== undefined) {
                let db_req = await this.add_to_database(hand, key)
                if (db_req !== undefined)
                    process_log += db_req;
                //console.log(db_req)
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

        window.location.reload()
    }

    add_to_database = async (user, key) => {
        var projID = firebase.database().ref().child('projects/').push().key;
        var x = firebase.database().ref('projects/' + projID).set(user)
            .then((x) => {
                //console.log('Succed')
                return "שורה " + (parseInt(key) + 2) + ':  נוספה בהצלחה'
            }).catch((err) => {
                return "שורה " + (parseInt(key) + 2) + ':  עדכון במסד נתונים נכשל'
            });
        return x
    }

    add_project = async (project) => {

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
                email: (document.getElementById("student_email" + num).value).toLowerCase(),
            }
        }
        if (numOfPartners.value === 2) {
            if (members[0].id > members[1].id) {
                console.log('TASDSDA!')
                var temp1 = members[0]
                members[0] = members[1]
                members[1] = temp1
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
        if (moder === 'Not selected') {
            error_st += 'project_supervisor_email does not exist'
        }

        let members = []
        var id = document.getElementById("student_id1")
        var name = document.getElementById("student_name1").value
        var email = document.getElementById("student_email1")

        if (id.checkValidity() === false)
            error_st += ' | student_id1 must be 9 digits'
        if (name === '')
            error_st += ' | student_name1'
        if (email.checkValidity() === false)
            error_st += ' | student_email1'


        members[0] = {
            id: id.value,
            name: name,
            email: email.value.toLowerCase(),
        }


        id = document.getElementById("student_id2")
        name = document.getElementById("student_name2")
        email = document.getElementById("student_email2")

        var err_2 = ''

        if (id.checkValidity() === false) {
            err_2 += ' | student_id2'
        }
        if (name.checkValidity() === false || name.value === '')
            err_2 += ' | student_name2'
        if (email.checkValidity() === false)
            err_2 += ' | student_email2'


        members[1] = {
            id: id.value,
            name: name.value,
            email: email.value.toLowerCase(),
        }

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

    return_git = (user, key, par) => {
        var stat = user.stats

        if (stat === undefined)
            return ''

        if (stat[key] === 0)
            return ''

        if (stat[key] !== my_underfined && stat[key] !== -1) {
            if (par === 'icon_git')
                return <img src={this.state.icon_github} class='mypointer' onClick={() => this.studentclick_git(user, key)} alt='github address'></img>
            else if (par === 'icon_github_progress')
                return <img src={this.state.icon_github_progress} class='mypointer' onClick={() => this.studentclick(user, key)} alt='github_progress'></img>
            else if (par === 'my_stat' && stat[key]['gitdate']) {
                var today = new Date()
                var year_today = today.getFullYear()
                var project_year = parseInt(user.year)

                var subtract = (today - new Date(stat[key]['gitdate'])) / 1000 / 60 / 60 / 24

                if ((year_today === project_year && today.getMonth() < 8) || (year_today + 1 === project_year && today.getMonth() >= 8)) {
                    if (subtract < green)
                        return <img src={this.state.icons_traffic[0]} alt='Green light' value='1'></img>
                    else if (subtract < yellow)
                        return <img src={this.state.icons_traffic[1]} alt='Yellow light' value='2'></img>
                    else
                        return <img src={this.state.icons_traffic[2]} alt='Red light' value='3'></img>
                }
                else
                    return <img src={this.state.icons_traffic[3]} alt='Red light' value='4'></img>

            }
            if (par === 'date' && stat[key]['gitdate']) {
                var gitdate = stat[key]['gitdate']
                var time = gitdate.split('T')
                var d = time[0].split('-')

                return <div><p />{d[2] + '/' + d[1] + '/' + d[0]}</div>
            }

            return <div><p />{stat[key][par]}</div>
        }



        if (stat[key] === -1 && par === 'icon_git')
            return <img src={this.state.icon_error} title={myerror} alt='github_Error'></img>

        return ''

    }

    return_mod_name = (user) => {
        if (user !== undefined && user.moderator_id) {
            if (this.state.moder_res !== my_underfined) {
                var mod = this.state.moder_res[user.moderator_id]
                if (mod !== undefined && mod.name!=='Not selected') 
                        return mod.name
            }
        }
        return 'לא נבחר מנחה!'
    }


    render() {
        return (
            <div className='ozbackground spec' >

                <MyTitle title="לוח פרוייקטים" />

                {this.state.loading ? (
                    <div className="ozbackground">
                        <div>

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


                            <table id='myTable' class="table table-dark table-striped table-bordered table-sm table-hover" dir='rtl'>
                                <thead class="">
                                    <tr>
                                        <th class="th-sm mypointer" scope="col" onClick={() => { this.sortTable(0) }} >שנה</th>
                                        <th width="10%" class="th-sm mypointer" scope="col" onClick={() => { this.sortTable(1) }} >שם הפרוייקט</th>
                                        {/* <th class="th-sm mypointer" scope="col" onClick={() => { this.sortTable(2) }} >שותפים</th> */}

                                        <th class="th-sm mypointer" scope="col" onClick={() => { this.sortTable(3) }} >ת.ז</th>
                                        <th class="th-sm mypointer" scope="col" onClick={() => { this.sortTable(4) }} >שמות</th>

                                        {/* <th class="th-sm mypointer" scope="col" onClick={() => { this.sortTable(5) }} >אימיילים</th> */}
                                        <th width="10%" class="th-sm mypointer" scope="col" onClick={() => { this.sortTable(6) }} >מנחה</th>

                                        <th class="th-sm" scope="col">יומן</th>
                                        <th width="1%" class="th-sm" scope="col">גיט</th>

                                        <th width="1%" class="th-sm" scope="col">קומיט אחרון</th>
                                        <th width="1%" class="th-sm" scope="col">מספר קומיטים</th>
                                        <th width="1%" class="th-sm" scope="col">חציון קבצים</th>
                                        <th width="1%" class="th-sm" scope="col">חציון שורות</th>
                                        <th width="1%" class="th-sm" scope="col">התקדמות בגיט</th>
                                        <th width="1%" class="th-sm" scope="col"><img src={this.state.traffic} alt="traffic light"></img></th>
                                        <th class="th-sm" scope="col">עריכה</th>
                                        <th class="th-sm" scope="col">מחיקה</th>
                                    </tr>

                                </thead>
                                <tbody id="mytbody">
                                    {this.state.users.map((user, index) => (
                                        <tr id={'tr_' + index}>

                                            <td id={'td_year_' + index}>{user.year}</td>
                                            <td width="10%">{user.project_name}</td>
                                            {/* {user.partners === 1 ? (<td>יחיד</td>) : (<td>זוגי</td>)} */}

                                            <td>
                                                <div>{user.members[0].id}</div>
                                                {user.members[1] ? (<div>{user.members[1].id}</div>) : (<div></div>)}
                                            </td>

                                            <td>
                                                <div class="myDIV">
                                                    <div>{user.members[0].name}</div>
                                                    {user.members[1] ? (<div>{user.members[1].name}</div>) : (<div></div>)}
                                                </div>

                                                <div class="hide">{"Email: "}
                                                    {user.members[0].email}

                                                    {user.members[1] ? (<div>
                                                        {"Email: " + user.members[1].email}

                                                    </div>) : (<div></div>)}
                                                </div>
                                            </td>
                                            {/* <td><div>{user.members[0].email}</div>
                                                {user.members[1] ? (<div>{user.members[1].email}</div>) : (<div></div>)}
                                            </td> */}


                                            <td width="10%" id={'td_mod_' + index} >{this.return_mod_name(user)}</td>

                                            {user.diary && user.diary === '' ? (<td></td>) : (<td><img id={'day_id_' + index} class='mypointer' alt='diary' onClick={() => this.studentclick_diary(user.diary)} src={this.state.icon_diary} ></img> </td>
                                            )}


                                            <td>{this.return_git(user, 0, 'icon_git')}
                                                {this.return_git(user, 1, 'icon_git')}

                                            </td>

                                            <td>
                                                <p />
                                                {this.return_git(user, 0, 'date')}
                                                {this.return_git(user, 1, 'date')}
                                            </td>

                                            <td>
                                                <p />
                                                {this.return_git(user, 0, 'Number_of_commits')}
                                                {this.return_git(user, 1, 'Number_of_commits')}
                                            </td>

                                            <td>
                                                <p />
                                                {this.return_git(user, 0, 'median_File')}
                                                {this.return_git(user, 1, 'median_File')}
                                            </td>

                                            <td>
                                                <p />
                                                {this.return_git(user, 0, 'median_Total')}
                                                {this.return_git(user, 1, 'median_Total')}
                                            </td>

                                            <td>{this.return_git(user, 0, 'icon_github_progress')}
                                                {this.return_git(user, 1, 'icon_github_progress')}
                                            </td>

                                            <td>
                                                {this.return_git(user, 0, 'my_stat')}
                                                {this.return_git(user, 1, 'my_stat')}
                                            </td>


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

                <br></br>



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
                                                <input pattern="[0-9]{9}" title="ת.ז מורכב מ9 ספרות" id="student_id1" class="form-control form-control-lg text-right" placeholder="תעודת זהות" required></input>
                                                <input type="text" id="student_name1" class="form-control form-control-lg text-right" placeholder="שם" required></input>
                                                <input type="email" id="student_email1" class="form-control form-control-lg text-right" placeholder="example@example.com" required></input>
                                            </div>
                                        </div>

                                        <div id='member2_form' className='nonethings'>סטודנט 2
                                            <br />
                                            <input pattern="[0-9]{9}" title="ת.ז מורכב מ9 ספרות" id="student_id2" class="form-control form-control-lg text-right" placeholder="תעודת זהות" required=""></input>
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
                                            <input id="git_id1" type="text" class="form-control form-control-lg text-right" placeholder="git_user/repository"></input>
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
        );
    }

}

export default Project_Dashboard;