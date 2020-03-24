'use strict';
function Task(id, task, dateOfStart, status, priority) {
    this.id = id;
    this.task = task;
    this.dateOfStart = checkForEmptiness(dateOfStart);
    this.status = checkForStatus(status);
    this.priority = checkForEmptiness(priority);
}
var checkForEmptiness = function checkForEmptiness(tool) {
    if (tool === undefined) {
        tool = "Not defined";
    }
        return tool;
};
var checkForStatus = function checkForStatus(tool) {
    if (tool === undefined) {
        tool = "Open";
    }
        return tool;
};