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
        const url = this.return_address()

        let promise = new Promise((res) => {
            setTimeout(() => res("Now it's done!"), 1000)
            axios.get(url)
                .then(res => {
                    return res.data
                }).then(res => {
                    console.log('size:' + res.length)
                    const fetchedUsers = new Array(res.length);

                    for (let key = 0; key < res.length; key++) {
                        axios.get(res[key].url)
                            .then(res2 => {
                                fetchedUsers[key]={
                                    date: res2.data.commit.author.date,
                                    title: res2.data.commit.message,
                                    total: res2.data.stats.total,
                                    files: res2.data.files.length,
                                    id: key
                                }
                            })
                    }

                    return fetchedUsers
                }).then((res) => {
                    this.setState({ users: res,check:true})
                    console.log('print!')
                }).catch((err)=>{
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
        var user = params2.get('gituser')
        var repos = params2.get('gitproject')
        return `https://api.github.com/repos/${user}/${repos}/commits`

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
                            {console.log(this.state.users)}

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