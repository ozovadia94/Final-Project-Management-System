import React, { Component } from 'react';
import MyTitle from '../Titles/Title'
import axios from 'axios';
import '../CSS/Add_User.css' /* CSS */

import my_header from '../Firebase/axiosGithub'

require('dotenv').config()

//import myheader from '../Firebase/axiosGithub'


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
    }


    componentDidMount() {
        this.create_Users();
    }

    create_Users = async () => {
        const url = this.return_address()
        const headers = my_header

        let promise = new Promise((res) => {
            setTimeout(() => res("Now it's done!"), 1600)
            axios.get(url, {
                "headers": headers
            }).then(res => {
                return res.data
            })
                .then(res => {
                    const fetchedUsers = new Array(res.length);
                    var k = -1
                    for (let key = 0; key < res.length; key++) {
                        k++
                        axios.get(res[key].url, {
                            "headers": headers
                        })
                            .then(res2 => {
                                var tempDate = ''
                                var myTime = ''
                                var myDate = ''

                                const gitdate = res2.data.commit.author.date

                                
                                for (let i = 0; i < gitdate.length; i++) {
                                    
                                        if (gitdate[i] === 'T') {
                                            tempDate = gitdate.substring(0, i);
                                            myTime = gitdate.substring(i+1, gitdate.length-1);
                                            break
                                        }
                                    
                                }
                                
                                    let num = 0
                                    for(let i = 0; i < tempDate.length; i++)
                                    {
                                        if(tempDate[i]==='-'){
                                            myDate = '/' + gitdate.substring(num,i) + myDate
                                            num = i+1
                                        }
                                        else if(i+1===tempDate.length)
                                            myDate = gitdate.substring(num,i+1) + myDate
                                    }
                                

                                fetchedUsers[key] = {
                                    date: myDate + '\n' + myTime,
                                    title: res2.data.commit.message,
                                    total: res2.data.stats.total,
                                    files: res2.data.files.length,
                                    id: key
                                }
                            })
                    }

                    return fetchedUsers
                }).then((res) => {
                    this.setState({ users: res, check: true })
                }).catch((err) => {
                    alert(err)
                    window.location.replace('/404');
                    console.log(err)
                });
        });
        // wait until the promise returns us a value
        await promise;

        // "Now it's done!"
        this.setState({ loading: true })

        return 0
    }



    sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }

    return_address() {
        const queryString = window.location.search;
        var params2 = new URLSearchParams(queryString);
        var user_repos = params2.get('git')

        return `https://api.github.com/repos/${user_repos}/commits`



    }

    render() {

        return (

            <div className="col-md-6">

                <MyTitle title="לוח התקדמות" />

                {this.state.loading ? (
                    <div>
                        <table id="commit_table" class="table">
                            <tr>
                                <th>#</th>
                                <th>Date</th>
                                <th>Name</th>
                                <th>Changed files</th>
                                <th>Changed words</th>

                            </tr>

                            {this.state.users.map(user => (
                                <tr>
                                    <th>{parseInt(user.id) + 1}</th>
                                    <th>{user.date}</th>
                                    <th>{user.title}</th>
                                    <th>{user.files}</th>
                                    <th>{user.total}</th>


                                </tr>
                            ))}


                        </table>
                    </div>
                ) : (<div>  </div>)}


            </div>




        );
    }

}

export default git;