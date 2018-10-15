module.exports = class SchedulerTask
{
    constructor(controller, entity, priority = 0, delay = 0) {
        this.controller = controller; // ID of controller
        this.entity = entity; // ID or name of entity
        this.priority = priority;
        this.time = Game.time + delay + 1;
    }

    static compare(a, b) {
        if(a.time < b.time) return 1;
        if(a.time > b.time) return -1;
        if(a.priority > b.priority) return 1;
        if(a.priority < b.priority) return -1;
        return 0;
    }
};