import React, { Component } from 'react';
import MyTitle from '../Titles/Title'
import '../CSS/Add_User.css' /* CSS */





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
        const gitHubForm = document.getElementById('gitHubForm');

        // Listen for submissions on GitHub username input form
        gitHubForm.addEventListener('submit', (e) => {

            // Prevent default form submission action
            e.preventDefault();

            // Get the GitHub username input field on the DOM
            let usernameInput = document.getElementById('usernameInput');
            let projectInput = document.getElementById('projectInput');

            // Get the value of the GitHub username input field
            let gitHubUsername = usernameInput.value;
            let gitHubProjectname = projectInput.value;

            // Run GitHub API function, passing in the GitHub username
            requestUserRepos(gitHubUsername,gitHubProjectname);

        })


        function requestUserRepos(username,rep) {
            console.log(username,rep)

            // Create new XMLHttpRequest object
            const xhr = new XMLHttpRequest();

            // GitHub endpoint, dynamically passing in specified username
            const url = `https://api.github.com/repos/${username}/${rep}/commits`;


            // Open a new connection, using a GET request via URL endpoint
            // Providing 3 arguments (GET/POST, The URL, Async True/False)
            xhr.open('GET', url, true);

            // When request is received
            // Process it here
            xhr.onload = function () {

                // Parse API data into JSON
                const data = JSON.parse(this.response);

                console.log(data)
                

                // Loop over each object in data array
                for (let i in data) {

                    // Get the ul with id of of userRepos
                    let ul = document.getElementById('userRepos');

                    // Create variable that will create li's to be added to ul
                    let li = document.createElement('li');

                    // Add Bootstrap list item class to each li
                    li.classList.add('list-group-item')

                    // Create the html markup for each li
                    li.innerHTML = (`
                <p><strong>Repo:</strong> ${data[i].name}</p>
                <p><strong>Description:</strong> ${data[i].description}</p>
                <p><strong>URL:</strong> <a href="${data[i].html_url}">${data[i].html_url}</a></p>
            `);

                    // Append each li to the ul
                    ul.appendChild(li);

                }
            }

            // Send the request to the server
            xhr.send();

        }

    }

    render() {

        return (

            <div className="col-md-6">

                <MyTitle title="טסט!" />
                <h1>asddas</h1>
                <h3 class="text-center mt-5">GitHub API</h3>
                <form id="gitHubForm" class="form-inline mx-auto">
                    <input id="usernameInput" class="form-control mb-5" type="text" name="username" placeholder="GitHub Username"></input>
                    <input id="projectInput" class="form-control mb-5" type="text" name="projectname" placeholder="GitHub project name"></input>
                    <input type="submit" class="btn btn-primary ml-2 mb-5" value="Submit"></input>
                </form>
                <ul id="userRepos" class="list-group mx-auto mb-5" >

                </ul>




            </div>




        );
    }

}

export default git;