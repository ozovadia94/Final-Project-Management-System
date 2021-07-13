import React, { Component } from 'react';
import MyTitle from '../Titles/Title'
import axios from 'axios';
import '../CSS/Pages.css' /* CSS */

import my_header from '../Firebase/axiosGithub'

// import axiosMonday from '../Firebase/axiosMonday'



require('dotenv').config()

const Epsilon = 180
const max_of_file=8
const max_of_total=300
const min_of_total=10

//import URLSearchParams from 'url-search-params'

var URLSearchParams = require('url-search-params');

//const moment = require('moment');


class git extends Component {
    constructor(props) {
        super(props);
        this.gituser = props.gituser
        this.gitproject = props.gitproject
    }

    state = {
        users: [],
        loading: false,
        check: false,
        selectedUserId: null,
        user_repos: null,
    }


    async componentDidMount() {
        await this.create_Users()
    }

    num_com = async (url, i, headers) => {
        return axios.get(url + i, { "headers": headers }).then((res) => {
            return res.data.length
        })
    }

    count_num_of_commits = async (url, headers) => {
        let my_url = url + '?per_page=100&page='
        var sum = 0

        for (let i = 1; i < 10; i++) {
            let k = await this.num_com(my_url, i, headers).then(res => { return res })
            sum += k

            if (k === 0)
                break;
        }
        return sum
    }

    create_Users = async () => {

        const url = await this.return_address()
        const headers = my_header


        await axios.get(url, { "headers": headers })
            .then(res => {
                return this.create_Array2(res.data);
                
                /*
                return [
                    {
                        "sha": "71475850f57becf121f4e10ddb7342717ea7480f",
                        "date": "17/05/2021",
                        "time": "20:46:42",
                        "gitDate": "2021-05-17T20:46:42Z",
                        "title": "fastcommit3",
                        "total": 2,
                        "addition": 0,
                        "deletion": 2,
                        "files": 1,
                        "name": "projectmanagementsystem20",
                        "email": "projectmanagementsystem20@gmail.com",
                        "id": 0,
                        "analize": "Frequent,\nSMALL,\n"
                    },
                    {
                        "sha": "ba00c8d3442158c6969c54f7c861ab5033c37af5",
                        "date": "17/05/2021",
                        "time": "20:46:32",
                        "gitDate": "2021-05-17T20:46:32Z",
                        "title": "fastcommit2",
                        "total": 2,
                        "addition": 1,
                        "deletion": 1,
                        "files": 1,
                        "name": "projectmanagementsystem20",
                        "email": "projectmanagementsystem20@gmail.com",
                        "id": 1,
                        "analize": "Frequent,\nSMALL,\n"
                    },
                    {
                        "sha": "30fdadb2cbd2975a5abc0ebbbbd8286b95de9705",
                        "date": "17/05/2021",
                        "time": "20:46:22",
                        "gitDate": "2021-05-17T20:46:22Z",
                        "title": "fastcommit1",
                        "total": 2,
                        "addition": 2,
                        "deletion": 0,
                        "files": 1,
                        "name": "projectmanagementsystem20",
                        "email": "projectmanagementsystem20@gmail.com",
                        "id": 2,
                        "analize": "Frequent,\nSMALL,\n"
                    },
                    {
                        "sha": "9e4b54cd5cc1f230e9110455bd2a753455869064",
                        "date": "17/05/2021",
                        "time": "20:45:05",
                        "gitDate": "2021-05-17T20:45:05Z",
                        "title": "change var name2",
                        "total": 2,
                        "addition": 1,
                        "deletion": 1,
                        "files": 1,
                        "name": "projectmanagementsystem20",
                        "email": "projectmanagementsystem20@gmail.com",
                        "id": 3,
                        "analize": "Frequent,\nSMALL,\n"
                    },
                    {
                        "sha": "441df9279c93225b5d33227014a87c7b824dc00c",
                        "date": "17/05/2021",
                        "time": "20:44:57",
                        "gitDate": "2021-05-17T20:44:57Z",
                        "title": "change func name 1",
                        "total": 2,
                        "addition": 1,
                        "deletion": 1,
                        "files": 1,
                        "name": "projectmanagementsystem20",
                        "email": "projectmanagementsystem20@gmail.com",
                        "id": 4,
                        "analize": "Frequent,\nSMALL,\n"
                    },
                    {
                        "sha": "c55680e537d3638dabcecf15eacd4f0957d065fb",
                        "date": "17/05/2021",
                        "time": "20:43:36",
                        "gitDate": "2021-05-17T20:43:36Z",
                        "title": "change var name2",
                        "total": 2,
                        "addition": 1,
                        "deletion": 1,
                        "files": 1,
                        "name": "projectmanagementsystem20",
                        "email": "projectmanagementsystem20@gmail.com",
                        "id": 5,
                        "analize": "Frequent,\nSMALL,\n"
                    },
                    {
                        "sha": "969ef2d9ded53fecf70de3d7f8b5d3f799108cbf",
                        "date": "17/05/2021",
                        "time": "20:43:23",
                        "gitDate": "2021-05-17T20:43:23Z",
                        "title": "change var name1",
                        "total": 2,
                        "addition": 1,
                        "deletion": 1,
                        "files": 1,
                        "name": "projectmanagementsystem20",
                        "email": "projectmanagementsystem20@gmail.com",
                        "id": 6,
                        "analize": "Frequent,\nSMALL,\n"
                    },
                    {
                        "sha": "c5bd42497777cf7042aba81e0f5a934eab71b802",
                        "date": "17/05/2021",
                        "time": "20:42:24",
                        "gitDate": "2021-05-17T20:42:24Z",
                        "title": "deleteemptyline",
                        "total": 24,
                        "addition": 0,
                        "deletion": 24,
                        "files": 1,
                        "name": "projectmanagementsystem20",
                        "email": "projectmanagementsystem20@gmail.com",
                        "id": 7,
                        "analize": "Frequent,\nSMALL,\n"
                    },
                    {
                        "sha": "3a3d31e191a68540611b4142a341efaf4d3f75e3",
                        "date": "17/05/2021",
                        "time": "20:41:47",
                        "gitDate": "2021-05-17T20:41:47Z",
                        "title": "emptyline2",
                        "total": 20,
                        "addition": 20,
                        "deletion": 0,
                        "files": 1,
                        "name": "projectmanagementsystem20",
                        "email": "projectmanagementsystem20@gmail.com",
                        "id": 8,
                        "analize": "Frequent,\nSMALL,\n"
                    },
                    {
                        "sha": "a6983bc999a00c5e452e0ab735a50d7e76dce79e",
                        "date": "17/05/2021",
                        "time": "20:41:34",
                        "gitDate": "2021-05-17T20:41:34Z",
                        "title": "emptyline1",
                        "total": 4,
                        "addition": 4,
                        "deletion": 0,
                        "files": 1,
                        "name": "projectmanagementsystem20",
                        "email": "projectmanagementsystem20@gmail.com",
                        "id": 9,
                        "analize": "Frequent,\nSMALL,\n"
                    },
                    {
                        "sha": "66ad5890fc5550dcc51e6111fcfd2687edff159e",
                        "date": "17/05/2021",
                        "time": "20:40:25",
                        "gitDate": "2021-05-17T20:40:25Z",
                        "title": "deletecomment",
                        "total": 4,
                        "addition": 0,
                        "deletion": 4,
                        "files": 1,
                        "name": "projectmanagementsystem20",
                        "email": "projectmanagementsystem20@gmail.com",
                        "id": 10,
                        "analize": "Frequent,\nSMALL,\n"
                    },
                    {
                        "sha": "07ae070cee43b3e16c3a3f0c723902ab018679de",
                        "date": "17/05/2021",
                        "time": "20:39:33",
                        "gitDate": "2021-05-17T20:39:33Z",
                        "title": "comment2",
                        "total": 1,
                        "addition": 1,
                        "deletion": 0,
                        "files": 1,
                        "name": "projectmanagementsystem20",
                        "email": "projectmanagementsystem20@gmail.com",
                        "id": 11,
                        "analize": "Frequent,\nSMALL,\n"
                    },
                    {
                        "sha": "1d16e79afabfd9345f23f0221d4b1cc8eb97d40b",
                        "date": "17/05/2021",
                        "time": "20:39:17",
                        "gitDate": "2021-05-17T20:39:17Z",
                        "title": "comment1",
                        "total": 2,
                        "addition": 2,
                        "deletion": 0,
                        "files": 1,
                        "name": "projectmanagementsystem20",
                        "email": "projectmanagementsystem20@gmail.com",
                        "id": 12,
                        "analize": "Frequent,\nSMALL,\n"
                    },
                    {
                        "sha": "ddd1f56a94cf714115b8705f590a55dbcc9012bf",
                        "date": "17/05/2021",
                        "time": "20:37:19",
                        "gitDate": "2021-05-17T20:37:19Z",
                        "title": "space2",
                        "total": 2,
                        "addition": 1,
                        "deletion": 1,
                        "files": 1,
                        "name": "projectmanagementsystem20",
                        "email": "projectmanagementsystem20@gmail.com",
                        "id": 13,
                        "analize": "Frequent,\nSMALL,\n"
                    },
                    {
                        "sha": "dc042c28686fcf3d4c8a3c309a783791da82a177",
                        "date": "17/05/2021",
                        "time": "20:36:46",
                        "gitDate": "2021-05-17T20:36:46Z",
                        "title": "space1",
                        "total": 2,
                        "addition": 1,
                        "deletion": 1,
                        "files": 1,
                        "name": "projectmanagementsystem20",
                        "email": "projectmanagementsystem20@gmail.com",
                        "id": 14,
                        "analize": "Frequent,\nSMALL,\n"
                    },
                    {
                        "sha": "a2d2a0174705b564c1874d3b621895a939d8e4aa",
                        "date": "17/05/2021",
                        "time": "20:34:40",
                        "gitDate": "2021-05-17T20:34:40Z",
                        "title": "BIGDELETE3",
                        "total": 5185,
                        "addition": 0,
                        "deletion": 5185,
                        "files": 60,
                        "name": "projectmanagementsystem20",
                        "email": "projectmanagementsystem20@gmail.com",
                        "id": 15,
                        "analize": "Frequent,\nBIG,\n"
                    },
                    {
                        "sha": "cc80e98a00b36a313a01266a5140c843f08ba344",
                        "date": "17/05/2021",
                        "time": "20:34:23",
                        "gitDate": "2021-05-17T20:34:23Z",
                        "title": "BIGDELETE2",
                        "total": 5185,
                        "addition": 0,
                        "deletion": 5185,
                        "files": 60,
                        "name": "projectmanagementsystem20",
                        "email": "projectmanagementsystem20@gmail.com",
                        "id": 16,
                        "analize": "Frequent,\nBIG,\n"
                    },
                    {
                        "sha": "584c709ac974a51ddd79a5d17d28b2bffd25795e",
                        "date": "17/05/2021",
                        "time": "20:34:06",
                        "gitDate": "2021-05-17T20:34:06Z",
                        "title": "BIGDELETE1",
                        "total": 5185,
                        "addition": 0,
                        "deletion": 5185,
                        "files": 60,
                        "name": "projectmanagementsystem20",
                        "email": "projectmanagementsystem20@gmail.com",
                        "id": 17,
                        "analize": "Frequent,\nBIG,\n"
                    },
                    {
                        "sha": "f89acf9b912fb86f3344ee4a923a4262f74e0013",
                        "date": "17/05/2021",
                        "time": "20:33:35",
                        "gitDate": "2021-05-17T20:33:35Z",
                        "title": "BIGTHINGS3",
                        "total": 5185,
                        "addition": 5185,
                        "deletion": 0,
                        "files": 60,
                        "name": "projectmanagementsystem20",
                        "email": "projectmanagementsystem20@gmail.com",
                        "id": 18,
                        "analize": "Frequent,\nBIG,\n"
                    },
                    {
                        "sha": "015b4b818a257744fe441680f6ac804c7e8f7835",
                        "date": "17/05/2021",
                        "time": "20:33:14",
                        "gitDate": "2021-05-17T20:33:14Z",
                        "title": "BIGTHINGS2",
                        "total": 5185,
                        "addition": 5185,
                        "deletion": 0,
                        "files": 60,
                        "name": "projectmanagementsystem20",
                        "email": "projectmanagementsystem20@gmail.com",
                        "id": 19,
                        "analize": "Frequent,\nBIG,\n"
                    },
                    {
                        "sha": "f72ce74355b1735b101c0c143f23ebf664711ade",
                        "date": "17/05/2021",
                        "time": "20:32:53",
                        "gitDate": "2021-05-17T20:32:53Z",
                        "title": "BIGTHINGS1",
                        "total": 27674,
                        "addition": 27674,
                        "deletion": 0,
                        "files": 129,
                        "name": "projectmanagementsystem20",
                        "email": "projectmanagementsystem20@gmail.com",
                        "id": 20,
                        "analize": "Frequent,\nBIG,\n"
                    },
                    {
                        "sha": "2d1ff6e75d2c71069992e8005cbee9029b5c16e3",
                        "date": "17/05/2021",
                        "time": "20:31:23",
                        "gitDate": "2021-05-17T20:31:23Z",
                        "title": "first commit",
                        "total": 70,
                        "addition": 70,
                        "deletion": 0,
                        "files": 1,
                        "name": "projectmanagementsystem20",
                        "email": "projectmanagementsystem20@gmail.com",
                        "id": 21,
                        "analize": "SMALL,\n"
                    }
                ]

                */
                // return this.create_Array(res.data);
            }).then((x) => {
                console.log(x)
                this.setState({ users: x, check: true })

                let len = x.length

                for (let i = 0; i < len - 1; i++) {
                    let a1 = Date.parse(x[i].gitDate) / (1000)
                    let a2 = Date.parse(x[i + 1].gitDate) / (1000)
                    //console.log(a1, a2, a1 - a2)
                    if (a1 - a2 < Epsilon) {
                        //if (x[i].analize != 'OK!')
                        x[i].analize = 'Frequent,\n';
                    }
                }


                for (let i = 0; i < len; i++) {
                    var str = ''
                    if (x[i].files > max_of_file || x[i].total > max_of_total)
                        str += 'BIG,\n'
                    if (x[i].total <= min_of_total)
                        str += 'SMALL,\n'

                    if (str !== '') {
                        if (x[i].analize === 'OK!')
                            x[i].analize = str
                        else
                            x[i].analize += str
                    }


                }
            })
            .then(() => {
                this.sleep(2000).then(() => {
                    this.setState({ loading: true })
                })

            })
            .catch(err => {
                alert('Project Not Found, Note! If this is a private git you need to get access from the owner!')
                console.log(err)
            })


        // this.sleep(150).then(() => {
        //     this.func()

        //     let temp = document.getElementById('deepcode_id')
        //     temp.innerText = 'OFir tabat'

        // }).catch((err) => {
        //     console.log(err)
        // })

        //let xx = await this.deepcode_func()
    }


    create_Array = async (res) => {
        let fetchedUsers = []; // new Array(res.length);

        for (let key = 0; key < res.length; key++) {
            axios.get(res[key].url, { "headers": my_header })
                .then(res2 => {
                    var tempDate = ''
                    var myTime = ''
                    var myDate = ''

                    const gitdate = res2.data.commit.author.date


                    for (let i = 0; i < gitdate.length; i++) {

                        if (gitdate[i] === 'T') {
                            tempDate = gitdate.substring(0, i);
                            myTime = gitdate.substring(i + 1, gitdate.length - 1);
                            break
                        }

                    }

                    let num = 0
                    for (let i = 0; i < tempDate.length; i++) {
                        if (tempDate[i] === '-') {
                            myDate = '/' + gitdate.substring(num, i) + myDate
                            num = i + 1
                        }
                        else if (i + 1 === tempDate.length)
                            myDate = gitdate.substring(num, i + 1) + myDate
                    }

                    fetchedUsers[key] = {
                        sha: res2.data.sha,
                        date: myDate + '\n' + myTime,
                        title: res2.data.commit.message,
                        total: res2.data.stats.total,
                        files: res2.data.files.length,
                        name: res2.data.commit.committer.name,
                        email: res2.data.commit.author.email,
                        id: key,
                        analize: 'OK!'
                    }
                })
        }
        // console.log(fetchedUsers, fetchedUsers.length);
        return fetchedUsers;
    }


    create_Array2_helper = async (res, key) => {
        let response = await axios.get(res.url, { "headers": my_header })

        var tempDate = '';
        var myTime = '';
        var myDate = '';
        const gitdate = response.data.commit.author.date;

        for (let i = 0; i < gitdate.length; i++) {
            if (gitdate[i] === 'T') {
                tempDate = gitdate.substring(0, i);
                myTime = gitdate.substring(i + 1, gitdate.length - 1);
                break
            }
        }

        let num = 0
        for (let i = 0; i < tempDate.length; i++) {
            if (tempDate[i] === '-') {
                myDate = '/' + gitdate.substring(num, i) + myDate
                num = i + 1
            }
            else if (i + 1 === tempDate.length)
                myDate = gitdate.substring(num, i + 1) + myDate
        }

        console.log()
        return {
            sha: response.data.sha,
            date: myDate,
            time: myTime,
            gitDate: gitdate,
            title: response.data.commit.message,
            total: response.data.stats.total,
            addition: response.data.stats.additions,
            deletion: response.data.stats.deletions,
            files: response.data.files.length,
            name: response.data.commit.committer.name,
            email: response.data.commit.author.email,
            id: key,
            analize: 'OK!'
        }

    }

    create_Array2 = async (res) => {
        let fetchedUsers = [];
        for (let i = 0; i < res.length; i++) {
            fetchedUsers[i] = await this.create_Array2_helper(res[i], i);
        }
        return fetchedUsers;
    }


    deepcode_func = async () => {
        var data = {
            "owner": '111',
            "repo": '222'
        }

        var options = {
            "headers": {
                "Content-Type": "application/json",
            }
        }



        await axios.post('http://localhost:3000/vsdeepcode', data, options).then((x) => {
            //console.log(x)
        }).catch((err) => {
            console.log(err)
        })
    }






    async return_address() {
        const queryString = window.location.search;
        var params2 = new URLSearchParams(queryString);
        var user = params2.get('git')
        this.setState({ user_repos: user })

        return `https://api.github.com/repos/${user}/commits`
    }

    sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    func = () => {
        axios.get('http://localhost:3000/deepcode/' + this.state.user_repos).then(res => {
            if (res.data.status === 'WAITING' || res.data.status === 'ANALYZING') {
                this.sleep(500).then(() => {
                    console.log('wait!')
                    return this.func()
                })
            }
            return res.data.analysisResults.suggestions
        }).then((res) => {
            this.sleep(2000)

            const th = {
                'API': 0,
                'Check': 0,
                'Defect': 0,
                'Info': 0,
                'Security': 0,
            }

            for (const property in res) {
                for (const cat in res[property].categories) {
                    //console.log(res[property].categories[cat])
                    th[res[property].categories[cat]] += 1
                }
            }

            return th
        }).then((res) => {

            //console.log(res)
        }).catch(err => {
            console.log(err)
        })
    }

    render() {

        return (

            <div className="ozbackground">
                <MyTitle title="לוח התקדמות" />

                <p></p>
                <div id='deepcode_id'></div>

                {this.state.loading ? (
                    <div class="ozbackground">
                        <div>
                            <table id="commit_table" class="table table-dark table table-striped table-bordered table-sm">
                                <tr>
                                    <th>#</th>
                                    <th>Date</th>
                                    {/* <th>Committer's Email</th> */}
                                    <th>Committer's Name</th>
                                    <th>Commit's Name</th>
                                    <th>Changed files</th>
                                    <th>Changed total</th>
                                    <th>Additions</th>
                                    <th>Deletions</th>
                                    <th>Analysis</th>

                                </tr>

                                {this.state.users.map(user => (
                                    <tr>
                                        <th >{parseInt(user.id) + 1}</th>
                                        <th>{user.date + '\n' + user.time}</th>
                                        {/* <th>{user.email}</th> */}
                                        <th>{user.name}</th>
                                        <th>{user.title}</th>
                                        <th>{user.files}</th>
                                        <th>{user.total}
                                            {/* <br></br>
                                            {'addition: ' + user.addition}
                                            <br></br>
                                            {"deletion: " + user.deletion} */}
                                        </th>
                                        <th>{user.addition}</th>
                                        <th>{user.deletion}</th>
                                        <th>{user.analize}</th>






                                    </tr>
                                ))}


                            </table>
                        </div>
                    </div>
                ) : (<div>  </div>)}



            </div>




        );
    }

}

export default git;