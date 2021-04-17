import React, { Component } from 'react';
import firebase from '../Firebase/Firebase'
import '../CSS/login.css'

class Login extends Component {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    login(e) {
        e.preventDefault();
        var mail_input = document.getElementById("mail_input");
        var password_input = document.getElementById("password_input");

        firebase.auth().signInWithEmailAndPassword(mail_input.value, password_input.value).then(() => {
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
            <div className='backgroundPage'>

                <div class="sidenav s12">
                    <div class="login-main-text">
                        <h2>מערכת לניהול פרוייקטי גמר</h2>
                        <p>דף התחברות</p>
                    </div>
                </div>
                <div class="sidenav s11">
                    <div class="col-md-6 col-sm-12">
                        <div class="login-form">
                            <form class='form1234'>
                                <div class="form-group">
                                    
                                    <input id="mail_input" class="form-control" type="email" name="email" onChange={this.handleChange}  placeholder="הכנס מייל" ></input>
                                </div>
                                <div class="form-group">
                                    
                                    <input id="password_input" class="form-control"  type="password"  onChange={this.handleChange} placeholder="הכנס סיסמא" ></input>
                                </div>
                                <button id="but_login" type="submit" class="btn btn-dark btn-lg btn-block" onClick={this.login}>התחבר</button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>


        );
    }
}
export default Login;