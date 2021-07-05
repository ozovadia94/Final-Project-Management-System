var addFieldsMembers = async () => {
    var numberOfmembers = document.getElementById("members");
    if (numberOfmembers === null)
        return
    else
        numberOfmembers = numberOfmembers.value


    var form = document.getElementById('member2_form')
    if (numberOfmembers === '1')
        form.className = 'nonethings'

    else if (numberOfmembers === '2')
        form.className = ''

}


var check_if_user_exist = async (users, members, year,check=false,id='') => {
    var cur_project; var cur_mem_users; var cur_mem;
    for (let k_mem = 0; k_mem < members.length; k_mem++) {
        cur_mem = members[k_mem]
        for (let k_user in users) {
            cur_project = users[k_user]
            for (let k_user_mem in cur_project.members) {
                cur_mem_users = cur_project.members[k_user_mem]
                if (cur_mem_users.id === cur_mem.id && cur_project.year === year && (check===false || (check===true && id!=='' && id!==cur_project.id)))
                    return ' | id ' + cur_mem_users.id +  ' exist in this year';
                if (cur_mem_users.email === cur_mem.email && cur_project.year === year && (check===false || (check===true && id!=='' && id!==cur_project.id))) {
                    return ' | id ' + cur_mem_users.email +  ' exist in this year';
                }
            }
        }
    }
}

var addFieldsGits = async () => {

    var numberOfGits = document.getElementById("numOfgits");
    if (numberOfGits === null)
        return
    else
        numberOfGits = numberOfGits.value

    var form = document.getElementById('git2_form')
    if (numberOfGits === '1')
        form.className = 'nonethings'

    else if (numberOfGits === '2')
        form.className = ''


}

var generateArrayOfYears = async (ifnew = true) => {
    var y = new Date().getFullYear()
    var min = 2018
    var max = y + 3

    var years = document.getElementById("project_year");
    var years_arr=[]

    for (var i = min; i < max; i++) {
        var year = document.createElement("option");;
        year.value = i
        year.innerHTML = i
        if (i === y) {
            year.selected = ' '
        }
        years.appendChild(year)
        years_arr.push(i)
    }
}



var Project_AddEdit_Function = {
    addFieldsMembers: addFieldsMembers,
    addFieldsGits: addFieldsGits,
    generateArrayOfYears: generateArrayOfYears,
    check_if_user_exist: check_if_user_exist,
}

export default Project_AddEdit_Function;