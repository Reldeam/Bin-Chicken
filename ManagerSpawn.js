const Manager = require('Manager');
const SchedulerTask = require('SchedulerTask');

const c = require('constants');

/**
 *
 * @type {module.ManagerSpawn}
 *
 * Memory
 *
 * - task (String) Current task.
 */
module.exports = class ManagerSpawn extends Manager
{
    request(type, spawn) {
        switch(type) {
            case 'task':
                this.requestTask(spawn);
                break;
            case 'reschedule':
                this.reschedule(spawn);
        }
    }

    requestTask(spawn) {
        let room = spawn.room;
        if(!room.memory.tradies || room.memory.tradies.length < c.MAX_TRADIES_PER_ROOM) {
            spawn.memory.task = c.SPAWN_TRADIE;
        }
        else spawn.memory.task = c.IDLE;
    }

    reschedule(spawn) {
        let task = new SchedulerTask(c.SPAWN_CONTROLLER, spawn.name);
        this.scheduler.add(task);
    }
};