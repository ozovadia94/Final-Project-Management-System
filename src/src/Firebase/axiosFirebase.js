import axios from 'axios';

const instance = axios.create({
        baseURL: 'https://project-management-system-oz-default-rtdb.firebaseio.com/'
});


export default instance;