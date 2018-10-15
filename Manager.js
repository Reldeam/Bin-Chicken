/**
 * The Manager takes requests and then changes the memory
 * state of the given entity based on the state of the
 * entire game.
 *
 * A Manager is not allowed to call any of the entity's
 * methods directly. It can only change it's memory.
 *
 * @type {module.Manager}
 */
module.exports = class Manager
{
    constructor(scheduler) {
        this.scheduler = scheduler;
    }

    request(type, entity) {};

    update(type, event) {};
};