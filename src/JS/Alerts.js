import Swal from 'sweetalert2'


var my_success = (titl,if_reload=true) => {
    Swal.fire({
        //position: 'top',
        icon: 'success',
        title: titl,
        showConfirmButton: false,
        timer: 1000
    }).then(()=>{
        if(if_reload)
            window.location.reload()
    })
}

var are_you_sure = async (text,id,func) => {
    Swal.fire({
        title: 'שים לב',
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'כן',
        cancelButtonText: 'לא'
        
      }).then((result) => {
        if (result.isConfirmed) 
            func(id)
      })
}

var my_error = (props) => {
    console.log(props)

    Swal.fire({
        icon: 'error',
        title: 'שגיאה!',
        text: props,
    })

}
var Alerts = {
    alert : my_success,
    error : my_error,
    are_you_sure: are_you_sure,
}

export default Alerts;