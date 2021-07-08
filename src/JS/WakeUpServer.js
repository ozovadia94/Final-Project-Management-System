import axios from 'axios';

var update_server = async () => {

    axios.get("https://projectmanagementserver.herokuapp.com/wtf").then((res)=>{
        console.log('finish')
    }).then((err)=>{
        console.log('err')
    })

}


var WakeUpServer = {
    update_server: update_server,
}

export default WakeUpServer;