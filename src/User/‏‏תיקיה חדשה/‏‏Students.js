import React, { Component } from 'react';
import MyTitle from '../Titles/Title'
import axios from 'axios';
import './Add_User.css' /* CSS */

const moment = require('moment');


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
        var st = this.return_address(this.gituser, this.gitproject)
        const fetchedUsers = [];
        axios.get(st)
            .then(res => {
                for (let key in res.data) {
                    fetchedUsers.push({
                        ...res.data[key],
                        id: key
                    });
                }
            }).then(res => {
                for (let key in fetchedUsers) {
                    axios.get(st + '/' + fetchedUsers[key].sha)
                        .then(res2 => {
                            fetchedUsers[key].stats = {
                                total: res2.data.stats.total,
                                additions: res2.data.stats.additions,
                                deletions: res2.data.stats.deletions,
                            };
                        })
                }
            }).then(res => {
                this.setState({ loading: true, users: fetchedUsers });
            })
            .catch(err => {
                this.setState({ loading: false });
            })

    }

    return_address(user, repos) {
        return 'https://api.github.com/repos/' + user + '/' + repos + '/commits'
    }

    render() {

        return (

            <div className="col-md-6">
                <form>
                    <div class="modal fade" id="modalLRForm" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                        <div class="modal-dialog cascading-modal" role="document">
                            <div class="modal-content">
                                <MyTitle title="לוח התקדמות" />

                                {this.state.loading ? (
                                    <div>
                                        <table class="table">
                                            <tr>
                                                <th>#</th>
                                                <th>Date1 </th>
                                                <th>Date2 </th>
                                                <th>Name</th>
                                                <th>Changes</th>
                                            </tr>

                                            {console.log(this.state.users)}
                                            {console.log(this.state.users[2])}
                                            {console.log(this.state.users[2].stats)}
                                            {this.state.users.map(user => (
                                                <tr>
                                                    <th>{user.id}</th>
                                                    <th>{moment(user.commit.author.date).format("DD/MM/YYYY HH:MM:SS")}</th>
                                                    <th>{user.commit.author.date}</th>
                                                    <th>{user.commit.message}</th>
                                                    <th>{user.stats}</th>
                                                    <th>{user.stats}</th>
                                                    <th>{user.stats}</th>
                                                </tr>
                                            ))}

                                        </table>
                                    </div>
                                ) : (<div>  </div>)}

                            </div>
                        </div>
                    </div>
                </form>
            </div>




        );
    }

}

export default git;