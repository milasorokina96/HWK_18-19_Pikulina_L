'use strict';
function Task(id, task, dateOfStart, status, priority) {
    this.id = id;
    this.task = task;
    this.dateOfStart = checkForEmptiness(dateOfStart);
    this.status = checkForStatus(status);
    this.priority = checkForEmptiness(priority);
};

let checkForEmptiness = (tool) => {
    if (tool === undefined) {
        tool = "Not defined";
    }
    return tool;
};
let checkForStatus = (tool) => {
    if (tool === undefined) {
        tool = "Open";
    }
    return tool;
};