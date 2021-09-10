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
        await this.create_array_of_projects()
    }

    create_array_of_projects = async () => {

        const url = await this.return_address()
        const headers = my_header


        await axios.get(url, { "headers": headers })
            .then(res => {
                return this.get_data_of_specific_git(res.data);
                
            }).then((x) => {
                // console.log(x)
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
                        str += 'Big,\n'
                    if (x[i].total <= min_of_total)
                        str += 'Small,\n'

                    if (str !== '') {
                        if (x[i].analize === 'Regular!')
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
    }

    get_data_of_specific_commit = async (res, key) => {
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
            analize: 'Regular!'
        }

    }

    get_data_of_specific_git = async (res) => {
        let fetchedUsers = [];
        for (let i = 0; i < res.length; i++) {
            fetchedUsers[i] = await this.get_data_of_specific_commit(res[i], i);
        }
        return fetchedUsers;
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