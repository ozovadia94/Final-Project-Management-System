import React, { Component } from 'react';
import MyTitle from '../Titles/Title'
import axios from 'axios';
import '../CSS/Pages.css' /* CSS */

import my_header from '../Firebase/axiosGithub'

import axiosMonday from '../Firebase/axiosMonday'
import { use } from 'passport';


require('dotenv').config()


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
        let res2 = await this.create_Users()


        // let url = 'https://api.monday.com/v2'

        // const query = `query{
        //     boards(ids: 1139310891){
        //       id
        //       name
        //       description
        //       items{id name}
        //     }
        //   }`;




        // let options = {
        //     "headers": axiosMonday
        // }

        // axios.get("https://api.monday.com/v2",{
        //     body: JSON.stringify({
        //         query,
        //     })},options
        // ).then(res => {
        //     console.log(res.data)
        //     console.log('WTF?')
        // }).catch((err)=>{
        //     console.log(err)
        // })


        // console.log(options)

        // axios.get(url, body, options).then(res => {
        //     console.log('Succes')
        //     console.log(res)
        //     return res.data
        // }).catch(err => {
        //     console.log(err)
        // })

    }


    create_Array = async (res) => {
        const fetchedUsers = new Array(res.length);

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
                        id: key
                    }
                })
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



        let res2 = await axios.post('http://localhost:3000/vsdeepcode', data, options).then((x) => {
            console.log(x)
        }).catch((err) => {
            console.log(err)
        })
    }


    create_Users = async () => {

        const url = await this.return_address()
        const headers = my_header
        

        let res = await axios.get(url, { "headers": headers })
            .then(res => {
                return this.create_Array(res.data);
            }).then((x) => {
                this.setState({ users: x, check: true })
            }).then(() => {
                this.sleep(2000).then(() => {
                    
                })
                console.log('1')

            })
            .catch(err => err)

        console.log('2')


        this.sleep(150).then(() => {
            this.func()
            console.log('sss')
        }).then(()=>{
            this.setState({ loading: true })
        }).catch((err)=>{
            this.setState({ loading: true })
        })



        //let xx = await this.deepcode_func()

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
                // console.log(`${property}`);
                //console.log(res[property])
                for (const cat in res[property].categories) {
                    console.log(res[property].categories[cat])
                    th[res[property].categories[cat]] += 1
                }
            }

            return th
        }).then((res) => {

            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    }

    render() {

        return (

            <div className="ozbackground">

                <div className="col-md-6">

                    <MyTitle title="לוח התקדמות" />

                    {this.state.loading ? (
                        <div>
                            <table id="commit_table" class="table">
                                <tr>
                                    <th>#</th>
                                    <th>Date</th>
                                    <th>Committer's Email</th>
                                    <th>Committer's Name</th>
                                    <th>Commit's Name</th>
                                    <th>Changed files</th>
                                    <th>Changed words</th>


                                </tr>

                                {this.state.users.map(user => (
                                    <tr>
                                        <th>{parseInt(user.id) + 1}</th>
                                        <th>{user.date}</th>
                                        <th>{user.email}</th>
                                        <th>{user.name}</th>
                                        <th>{user.title}</th>
                                        <th>{user.files}</th>
                                        <th>{user.total}</th>






                                    </tr>
                                ))}


                            </table>
                        </div>
                    ) : (<div>  </div>)}


                </div>
            </div>




        );
    }

}

export default git;