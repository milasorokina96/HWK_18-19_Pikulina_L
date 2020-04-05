'use strict';

let AJAXRequest = () => {
    fetch('state.json')
        .then((res) => res.json())
        .then((res) => {
            const statusesValues = Object.values(res['statuses']);
            for (let  s = 0; s < statusesValues.length; s++){
                statuses.push(statusesValues[s]);
            }
            const prioritiesValues = Object.values(res['priorities']);
            for (let  p = 0; p < prioritiesValues.length; p++){
                priorities.push(prioritiesValues[p]);
            }
            reload();
            toDoList();
        });
};

let toDoList = () => {
    document.getElementById('crud').innerHTML = '';
    creatTable();
    showViewCard();
    showEditCard();
    removeCard();
    addNewTask();
};

let creatTable = () => {
    $('#card').hide();
    const section = document.getElementById('crud');
    section.innerHTML = '';
    section.innerHTML += '<div class="add__block"><button type="button" name="add">Add</button></div>';
    section.innerHTML += '<table border="1" id="tableInfo" class="table__info"></table>';
    const table = document.getElementById('tableInfo');
    table.innerHTML = '';
    for(let i = 0; i < list.length; i++) {

        table.innerHTML += '<tr></tr>';
        let tr = document.querySelector('tbody:nth-child(' + (i + 1) + ') tr');

        for (let value in list[i]) {
            if (value === 'status' && statuses.indexOf(list[i]['status']) === -1) {
                list[i]['status'] = undefined;
                list[i]['status'] = checkForEmptiness(list[i]['status']);
            }
            if (value === 'priority' && priorities.indexOf(list[i]['priority']) === -1) {
                list[i]['priority'] = undefined;
                list[i]['priority'] = checkForEmptiness(list[i]['priority']);
            }
            tr.innerHTML += `<td class="${value}">${list[i][value]}</td>`;
        }
        tr.innerHTML += '<td><button type="button" name="view">View</button><button type="button" name="edit">Edit</button><button type="button" name="remove">Remove</button></td>';
    }
};

let creatViewCard = (index) => {
    $('#card').show();
    const form = document.getElementById('cardForm');
    form.innerHTML = '';
    for (let key in list[index]) {
        form.innerHTML += `<div>${key}: ${list[index][key]}</div>`;
    }
};

let showViewCard = () => {
    let buttonView = document.querySelectorAll('button[name="view"]');
    for (let b = 0; b < buttonView.length; b++) {
        buttonView[b].addEventListener('click', () => creatViewCard(b));
    }
};

let creatCardForEdit = (index) => {
    const form = document.getElementById('cardForm');
    form.innerHTML = '';
    $('#card').show();
    if (typeof index === 'object') {
        list[index] = index;
    }
    for (let key in list[index]) {
        list[index][key] === undefined ? list[index][key] = '' : list[index][key];
        if (key === 'status') {
            form.innerHTML += `<div class="form_${key}">${key}<select name="${key}"></select></div>`;
            for (let s = 0; s < statuses.length; s++) {
                document.querySelector('select[name="status"]').innerHTML += `<option>${statuses[s]}</option>`;
            }
        } else if (key === 'priority') {
            form.innerHTML += `<div class="form_${key}">${key}<select name="${key}"></select></div>`;
            for (let p = 0; p < priorities.length; p++) {
                document.querySelector('select[name="priority"]').innerHTML += `<option>${priorities[p]}</option>`;
            }
        } else {
            form.innerHTML += `<div class="form_${key}">${key}: <input type="text" name="${key}" value="${list[index][key]}"></div>`;
        }
        document.querySelector(`.form_${key}`).innerHTML += `<div class="error">Enter correct ${key}</div>`;
        $(`.form_${key} > .error`).hide();;
    }
    form.innerHTML += '<div><button type="button" class="save">Save</button></div>';
    saveNewInfo(index);
};

let showEditCard = () => {
    let buttonEdit = document.querySelectorAll('button[name="edit"]');
    for (let b = 0; b < buttonEdit.length; b++) {
        buttonEdit[b].addEventListener('click', () => creatCardForEdit(b));
    }
};

let pushValueToTable = (index) => {
    if (typeof index === 'object') {
        list.push(index);
    }
    const form = document.forms.cardForm;
    for (let key in list[index]) {
        if (key === 'status') {
            list[index]['status'] = form.elements.status.value;
        } else if (key === 'priority') {
            list[index]['priority'] = form.elements.priority.value;
        } else {
            list[index][key] = document.querySelector(`input[name="${key}"]`).value;
        }
    }
};

let validate = (isValid, key) => {
    if (!isValid) {
        $(`.form_${key} > .error`).show();
    } else {
        $(`.form_${key} > .error`).hide();;
    }
};

let isValid = (value, key, pattern) => {
    return pattern[key].test(value);
};

let saveNewInfo = (index) => {
    document.querySelector('.save').addEventListener('click', () => {
        const valuePattern = {
            id: /\d/,
            task: /^[A-Z]{1}\s{0,}[a-z]{1,}/,
            status: /^[A-Z]{1}\s{0,}[a-z]{1,}/,
            priority: /^[A-Z]{1}\s{0,}[a-z]{1,}/,
            dateOfStart: /((^([0-9]{2})\.([0-9]{2})\.([2][0-9]{3})$) || (^[A-Z]{1}\s{0,}[a-z]{1,}))/
        };

        const validValues = {};
        const elements = document.forms.cardForm.elements;
        const elementsArr = Object.values(elements);

        for (let element of elementsArr) {
            if (!element.name) {
                continue;
            }
            const isValueValid = isValid(element.value, element.name, valuePattern);

            if (isValueValid) {
                validValues[element.name] = element.value;
            } else {
                delete validValues[element.name];
            }
            validate(isValueValid, element.name);
        }

        if (Object.keys(validValues).length === (Object.keys(list[index]).length)) {
            $('#card').hide();
            pushValueToTable(index);
            toDoList();
            pushToLocalStorage();
        }
    });
};

function removeCard() {
    let buttonRemove = document.querySelectorAll('button[name="remove"]');
    for (let b = 0; b < buttonRemove.length; b++) {
        buttonRemove[b].addEventListener('click', () => {
            creatModal(b);
            consentForRemove(b);

        });
    }
}
let creatModal = (b) => {
    $('#card').hide();
    $('#modalBody').text(`Do you want to remove task ${list[b]['task']} with id ${list[b]['id']} ?`);
    $('#modalWindow').modal({
        keyboard: false
    });
};

let consentForRemove = (b) => {
    ((b) => {
        document.getElementById('yesForDelete').onclick = () => {
            list.splice(b, 1);
            toDoList();
            pushToLocalStorage();
            $('#modalWindow').modal('hide');
        };
    })(b);
};

let addNewTask = () => {
    let buttonAdd = document.querySelector('button[name="add"]');
    buttonAdd.addEventListener('click', () => {
        let newTask;
        newTask = new Task();
        newTask['dateOfStart'] = moment().format('DD.MM.YYYY');

        creatCardForEdit(newTask);
    });
};

let pushToLocalStorage = () => {
    let userInJSONFormat = JSON.stringify(list);
    return localStorage.setItem('list', userInJSONFormat);
};

let reload = () => {
    if (localStorage.getItem('list')) {
        return list = JSON.parse(localStorage.getItem('list'));
    }
    pushToLocalStorage();
};