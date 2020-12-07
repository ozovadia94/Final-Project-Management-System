import React, { Component } from 'react';
import firebase from '../Firebase/Firebase'
import './login.css'

class Login extends Component {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            email: '',
            password: '',
        };
    }

    login(e) {
        e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(() => {
            window.location.href = "";
        }).catch((error) => {
            alert("המשתמש או הסיסמא שגויים");
            console.log(error)
        });
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        return (
            <div>

                <div class="sidenav">
                    <div class="login-main-text">
                        <h2>מערכת לניהול פרוייקטי גמר</h2>
                        <p>דף התחברות</p>
                    </div>
                </div>
                <div class="main">
                    <div class="col-md-6 col-sm-12">
                        <div class="login-form">
                            <form>
                                <div class="form-group">
                                    <label>Mail</label>
                                    <input id="mail_input" class="form-control" type="email" name="email" onChange={this.handleChange}  placeholder="הכנס מייל" value={this.state.email}></input>
                                </div>
                                <div class="form-group">
                                    <label>Password</label>
                                    <input id="password_input" class="form-control"  type="password" name="password" onChange={this.handleChange} placeholder="הכנס סיסמא" value={this.state.password}></input>
                                </div>
                                <button id="but_login" type="submit" class="btn btn-black" onClick={this.login}>Login</button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>


        );
    }
}
export default Login;