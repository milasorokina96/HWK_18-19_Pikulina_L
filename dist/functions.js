'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var AJAXRequest = function AJAXRequest() {
    fetch('state.json').then(function (res) {
        return res.json();
    }).then(function (res) {
        var statusesValues = Object.values(res['statuses']);
        for (var s = 0; s < statusesValues.length; s++) {
            statuses.push(statusesValues[s]);
        }
        var prioritiesValues = Object.values(res['priorities']);
        for (var p = 0; p < prioritiesValues.length; p++) {
            priorities.push(prioritiesValues[p]);
        }
        reload();
        toDoList();
    });
};

var toDoList = function toDoList() {
    document.getElementById('crud').innerHTML = '';
    creatTable();
    showViewCard();
    showEditCard();
    removeCard();
    addNewTask();
};

var creatTable = function creatTable() {
    $('#card').hide();
    var section = document.getElementById('crud');
    section.innerHTML = '';
    section.innerHTML += '<div class="add__block"><button type="button" name="add">Add</button></div>';
    section.innerHTML += '<table border="1" id="tableInfo" class="table__info"></table>';
    var table = document.getElementById('tableInfo');
    table.innerHTML = '';
    for (var i = 0; i < list.length; i++) {

        table.innerHTML += '<tr></tr>';
        var tr = document.querySelector('tbody:nth-child(' + (i + 1) + ') tr');

        for (var value in list[i]) {
            if (value === 'status' && statuses.indexOf(list[i]['status']) === -1) {
                list[i]['status'] = undefined;
                list[i]['status'] = checkForEmptiness(list[i]['status']);
            }
            if (value === 'priority' && priorities.indexOf(list[i]['priority']) === -1) {
                list[i]['priority'] = undefined;
                list[i]['priority'] = checkForEmptiness(list[i]['priority']);
            }
            tr.innerHTML += '<td class="' + value + '">' + list[i][value] + '</td>';
        }
        tr.innerHTML += '<td><button type="button" name="view">View</button><button type="button" name="edit">Edit</button><button type="button" name="remove">Remove</button></td>';
    }
};

var creatViewCard = function creatViewCard(index) {
    $('#card').show();
    var form = document.getElementById('cardForm');
    form.innerHTML = '';
    for (var key in list[index]) {
        form.innerHTML += '<div>' + key + ': ' + list[index][key] + '</div>';
    }
};

var showViewCard = function showViewCard() {
    var buttonView = document.querySelectorAll('button[name="view"]');

    var _loop = function _loop(b) {
        buttonView[b].addEventListener('click', function () {
            return creatViewCard(b);
        });
    };

    for (var b = 0; b < buttonView.length; b++) {
        _loop(b);
    }
};

var creatCardForEdit = function creatCardForEdit(index) {
    var form = document.getElementById('cardForm');
    form.innerHTML = '';
    $('#card').show();
    if ((typeof index === 'undefined' ? 'undefined' : _typeof(index)) === 'object') {
        list[index] = index;
    }
    for (var key in list[index]) {
        list[index][key] === undefined ? list[index][key] = '' : list[index][key];
        if (key === 'status') {
            form.innerHTML += '<div class="form_' + key + '">' + key + '<select name="' + key + '"></select></div>';
            for (var s = 0; s < statuses.length; s++) {
                document.querySelector('select[name="status"]').innerHTML += '<option>' + statuses[s] + '</option>';
            }
        } else if (key === 'priority') {
            form.innerHTML += '<div class="form_' + key + '">' + key + '<select name="' + key + '"></select></div>';
            for (var p = 0; p < priorities.length; p++) {
                document.querySelector('select[name="priority"]').innerHTML += '<option>' + priorities[p] + '</option>';
            }
        } else {
            form.innerHTML += '<div class="form_' + key + '">' + key + ': <input type="text" name="' + key + '" value="' + list[index][key] + '"></div>';
        }
        document.querySelector('.form_' + key).innerHTML += '<div class="error">Enter correct ' + key + '</div>';
        $('.form_' + key + ' > .error').hide();;
    }
    form.innerHTML += '<div><button type="button" class="save">Save</button></div>';
    saveNewInfo(index);
};

var showEditCard = function showEditCard() {
    var buttonEdit = document.querySelectorAll('button[name="edit"]');

    var _loop2 = function _loop2(b) {
        buttonEdit[b].addEventListener('click', function () {
            return creatCardForEdit(b);
        });
    };

    for (var b = 0; b < buttonEdit.length; b++) {
        _loop2(b);
    }
};

var pushValueToTable = function pushValueToTable(index) {
    if ((typeof index === 'undefined' ? 'undefined' : _typeof(index)) === 'object') {
        list.push(index);
    }
    var form = document.forms.cardForm;
    for (var key in list[index]) {
        if (key === 'status') {
            list[index]['status'] = form.elements.status.value;
        } else if (key === 'priority') {
            list[index]['priority'] = form.elements.priority.value;
        } else {
            list[index][key] = document.querySelector('input[name="' + key + '"]').value;
        }
    }
};

var validate = function validate(isValid, key) {
    if (!isValid) {
        $('.form_' + key + ' > .error').show();
    } else {
        $('.form_' + key + ' > .error').hide();;
    }
};

var isValid = function isValid(value, key, pattern) {
    return pattern[key].test(value);
};

var saveNewInfo = function saveNewInfo(index) {
    document.querySelector('.save').addEventListener('click', function () {
        var valuePattern = {
            id: /\d/,
            task: /^[A-Z]{1}\s{0,}[a-z]{1,}/,
            status: /^[A-Z]{1}\s{0,}[a-z]{1,}/,
            priority: /^[A-Z]{1}\s{0,}[a-z]{1,}/,
            dateOfStart: /((^([0-9]{2})\.([0-9]{2})\.([2][0-9]{3})$) || (^[A-Z]{1}\s{0,}[a-z]{1,}))/
        };

        var validValues = {};
        var elements = document.forms.cardForm.elements;
        var elementsArr = Object.values(elements);

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = elementsArr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var element = _step.value;

                if (!element.name) {
                    continue;
                }
                var isValueValid = isValid(element.value, element.name, valuePattern);

                if (isValueValid) {
                    validValues[element.name] = element.value;
                } else {
                    delete validValues[element.name];
                }
                validate(isValueValid, element.name);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        if (Object.keys(validValues).length === Object.keys(list[index]).length) {
            $('#card').hide();
            pushValueToTable(index);
            toDoList();
            pushToLocalStorage();
        }
    });
};

function removeCard() {
    var buttonRemove = document.querySelectorAll('button[name="remove"]');

    var _loop3 = function _loop3(b) {
        buttonRemove[b].addEventListener('click', function () {
            creatModal(b);
            consentForRemove(b);
        });
    };

    for (var b = 0; b < buttonRemove.length; b++) {
        _loop3(b);
    }
}
var creatModal = function creatModal(b) {
    $('#card').hide();
    $('#modalBody').text('Do you want to remove task ' + list[b]['task'] + ' with id ' + list[b]['id'] + ' ?');
    $('#modalWindow').modal({
        keyboard: false
    });
};

var consentForRemove = function consentForRemove(b) {
    (function (b) {
        document.getElementById('yesForDelete').onclick = function () {
            list.splice(b, 1);
            toDoList();
            pushToLocalStorage();
            $('#modalWindow').modal('hide');
        };
    })(b);
};

var addNewTask = function addNewTask() {
    var buttonAdd = document.querySelector('button[name="add"]');
    buttonAdd.addEventListener('click', function () {
        var newTask = void 0;
        newTask = new Task();
        newTask['dateOfStart'] = moment().format('DD.MM.YYYY');

        creatCardForEdit(newTask);
    });
};

var pushToLocalStorage = function pushToLocalStorage() {
    var userInJSONFormat = JSON.stringify(list);
    return localStorage.setItem('list', userInJSONFormat);
};

var reload = function reload() {
    if (localStorage.getItem('list')) {
        return list = JSON.parse(localStorage.getItem('list'));
    }
    pushToLocalStorage();
};