import React, { Component } from 'react';
import MyTitle from '../Titles/Title'
import axios from 'axios';
import '../CSS/Add_User.css' /* CSS */

//import urlParams from 'url-search-params'

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
        var st = this.return_address()
        const fetchedUsers = [];

        let promise = new Promise((res) => {
            setTimeout(() => res("Now it's done!"), 1522)
            axios.get(st)
                .then(res => {
                    for (let key in res.data) {
                        fetchedUsers.push({
                            ...res.data[key],
                            id: key,
                        });
                    }
                    return fetchedUsers
                }).then(res => {
                    console.log('size:' + res.length)
                    for (let key = 0; key < res.length; key++) {
                        axios.get(st + '/' + res[key].sha)
                            .then(res2 => {
                                fetchedUsers[key]['additions'] = res2.data.stats.additions
                                fetchedUsers[key]['deletions'] = res2.data.stats.deletions
                                fetchedUsers[key]['total'] = res2.data.stats.total
                                fetchedUsers[key]['files'] = res2.data.files.length
                            })

                        console.log(key)
                    }
                }).then(() => {
                    this.setState({ users: fetchedUsers,check:true})
                    console.log('print!')
                }).catch((err)=>{
                    alert(err)
                    console.log(err)

                })
        });
        // wait until the promise returns us a value

        promise.finally(() => {
            
            console.log('OK!')
        });
        // "Now it's done!"
        while(1){
            if(this.state.check===true)
            {
                this.setState({ loading: true })
                break
            }
        }
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
        var user = params2.get('gituser')
        var repos = params2.get('gitproject')
        return 'https://api.github.com/repos/' + user + '/' + repos + '/commits'
    }

    render() {

        return (

            <div className="col-md-6">

                <MyTitle title="לוח התקדמות" />

                {this.state.loading ? (
                    <div>
                        <table class="table">
                            <tr>
                                <th>#</th>
                                <th>Date</th>
                                <th>Name</th>
                                <th>Num Changes</th>
                                <th>File Changes</th>
                            </tr>

                            {console.log(this.state.users)}


                            {this.state.users.map(user => (
                                <tr>
                                    <th>{parseInt(user.id) + 1}</th>
                                    <th>{user.commit.author.date}</th>
                                    <th>{user.commit.message}</th>
                                    <th>{user.total}</th>
                                    <th>{user.files}</th>
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