const Manager = require('Manager');
const SchedulerTask = require('SchedulerTask');

const c = require('constants');

const debug = require('debug');
const debugKey = 'MNGR Room';
debug.addKey(debugKey);

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
        debug.setKey(debugKey);

        switch(type) {
            case 'task':
                debug.msg('Requesting task for ' + spawn);
                this.requestTask(spawn);
                break;
            case 'renew':
                debug.msg('Requesting renew for ' + spawn);
                this.requestRenew(spawn);
            case 'reschedule':
                debug.msg('Requesting reschedule for ' + spawn);
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

    requestRenew(spawn) {
        // Only renew if not doing anything else.
        if(spawn.memory.task !== c.TASK_IDLE) {
            return;
        }

        // Final all the creeps around the spawn that need renewing.
        let creeps = spawn.findInRange(FIND_CREEPS, 1);
        _.remove(creeps, function(creep) {
            return(creep.memory.task !== c.TASK_RENEW);
        });

        if(creeps.length > 0) {
            spawn.memory.task = c.TASK_RENEW;
            spawn.memory.taskTarget = creeps[0].name;
        }
    }

    reschedule(spawn) {
        let task = new SchedulerTask(c.SPAWN_CONTROLLER, spawn.name);
        this.scheduler.add(task);
    }
};