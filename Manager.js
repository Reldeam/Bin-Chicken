module.exports = class Manager
{
    constructor(scheduler) {
        this.scheduler = scheduler;
    }

    request(type, entity) {};
};