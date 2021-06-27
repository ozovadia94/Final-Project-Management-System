import React, { Component } from 'react';
import '../CSS/Pages.css' /* CSS */


class Add_moderator extends Component {

    state = {
        moderators: [],
    }


    render() {
        return (

            <div>
                <form id="myForm" onSubmit={this.props.handleSubmit()}>
                    <div>
                        <div class="form-group">
                            <label for="moderator_name">שם המנחה</label>
                            <input id='moderator_name' type="text" class="form-control form-control-lg text-right" required placeholder="שם מלא" ref={(input) => this.input = input}></input>
                        </div>
                        
                        <div class="form-group">
                        <label for="moderator_email">אימייל</label>
                            <input id='moderator_email' type="email" class="form-control form-control-lg text-right" required placeholder="example@gmail.com" ref={(input3) => this.input3 = input3}></input>
                        </div>
                    </div>
                    <div>
                        <button type="submit" class="btn btn-dark btn-lg btn-block">{this.props.mybut}</button>
                    </div>
                </form>
            </div>
        );
    }

}



export default Add_moderator;