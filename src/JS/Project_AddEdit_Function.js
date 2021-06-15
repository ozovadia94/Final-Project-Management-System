var addFieldsMembers = async () => {
    // Number of inputs to create
    var numberOfmembers = document.getElementById("members");
    if (numberOfmembers === null)
        return
    else
        numberOfmembers = numberOfmembers.value

    var container = document.getElementById("container");//container of members

    var sum_element_now = container.childElementCount

    if (numberOfmembers > sum_element_now) {
        for (var i = sum_element_now; i < numberOfmembers; i++) {
            // Append a node with a random text
            let num = i + 1

            var input1 = document.createElement("input");
            input1.type = "number";
            input1.id = "member_id" + num;
            input1.className = "form-control form-control-lg text-right"
            input1.placeholder = "תעודת זהות"
            input1.required = true
            var input2 = document.createElement("input");
            input2.type = "email";
            input2.id = "member_mail" + num;
            input2.className = "form-control form-control-lg text-right"
            input2.placeholder = "example@example.com"
            input2.required = true
            var input3 = document.createElement("input");
            input3.type = "text";
            input3.id = "member_name" + num;
            input3.className = "form-control form-control-lg text-right"
            input3.placeholder = "שם"
            input3.required = true

            var input = document.createElement("div");
            input.appendChild(document.createTextNode("סטודנט " + num));
            input.appendChild(document.createElement("br"));
            input.appendChild(input1)
            input.appendChild(input3)
            input.appendChild(input2)
            input.appendChild(document.createElement("br"));


            container.appendChild(input);
        }
    }
    else
        for (let y = sum_element_now; y > numberOfmembers; y--)
            y = container.removeChild(container.lastChild)
}
var addFieldsGits = async () => {
    // Number of inputs to create
    var numberOfGits = document.getElementById("numOfgits");
    if (numberOfGits === null)
        return
    else
        numberOfGits = numberOfGits.value

    // Container <div> where dynamic content will be placed
    var container = document.getElementById("containerGit");

    var sum_element_now = container.childElementCount

    if (numberOfGits > sum_element_now) {
        for (var i = sum_element_now; i < numberOfGits; i++) {
            // Append a node with a random text

            var input1 = document.createElement("input");
            input1.type = "text";
            input1.id = "git_id" + (i + 1);
            input1.className = "form-control form-control-lg text-right"
            input1.placeholder = "git_user/repository"

            input1.appendChild(document.createElement("p"));
            container.appendChild(input1);
            // Append a line break 

        }
    }
    else
        for (let y = sum_element_now; y > numberOfGits; y--)
            y = container.removeChild(container.lastChild)
}

var generateArrayOfYears = (ifnew=true) => {
    var y = new Date().getFullYear()
    var min = 2018
    var max = y + 3

    var years = document.getElementById("project_year");

    for (var i = min; i < max; i++) {
        var year =  document.createElement("option");;
        year.value = i
        year.innerHTML=i
        if(i===y)
        {
            year.selected=' '
        }
        years.appendChild(year)
    }
}



var Project_AddEdit_Function = {
    addFieldsMembers : addFieldsMembers,
    addFieldsGits : addFieldsGits,
    generateArrayOfYears: generateArrayOfYears,
}

export default Project_AddEdit_Function;