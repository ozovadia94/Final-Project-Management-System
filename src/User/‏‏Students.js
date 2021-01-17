import React, { Component } from 'react';
import MyTitle from '../Titles/Title'
import axios from 'axios';
import './Add_User.css' /* CSS */

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
        selectedUserId: null,
    }


    componentDidMount() {
        this.create_Users().then(res => {
            console.log('HERE1')
            console.log(res)
            console.log('HERE2')
            return true
        }).then(res => {
            this.setState({ loading: true });
            console.log('HERE3')
        }).catch(err => {
            this.setState({ loading: false });
        })
    }

    create_Users = async () => {
        var st = this.return_address()
        const fetchedUsers = [];

        let promise = new Promise((res) => {
            setTimeout(() => res("Now it's done!"), 2000)
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
                        console.log('asd')
                        axios.get(st + '/' + res[key].sha)
                            .then(res2 => {
                                fetchedUsers[key]['additions']=res2.data.stats.additions
                                fetchedUsers[key]['deletions']=res2.data.stats.deletions
                                fetchedUsers[key]['total']=res2.data.stats.total
                            })

                    }
                })
        });
        // wait until the promise returns us a value
        let result = await promise;

        // "Now it's done!"
        this.sleep(2000)
        this.setState({users: fetchedUsers, });

        return fetchedUsers
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
                            <th>Changes</th>
                        </tr>

                        {this.state.users.map(user => (
                            <tr>
                                <th>{parseInt(user.id) + 1}</th>
                                <th>{user.commit.author.date}</th>
                                <th>{user.commit.message}</th>
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