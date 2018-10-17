const Controller = require('Controller');
const EventTradie = require('EventTradie');
const c = require('constants');

const debug = require('debug');
const debugKey = 'CTR Tradie';
debug.addKey(debugKey);

module.exports = class ControllerTradie extends Controller
{
    run(tradieName) {
        debug.setKey(debugKey);
        debug.msg('Running tradie controller for, ' + tradieName + '...');

        let tradie = Game.creeps[tradieName];

        // Tradie doesn't exists (probably died).
        if(!tradie) {
            debug.err('Tradie, ' + tradieName + ' does not exist!');
            this.managers.tradie.request(c.REQUEST_REMOVE, tradieName);
            debug.unsetKey();
            return;
        }

        // Tradie is still spawning.
        if(tradie.spawning) {
            debug.wrn('Tradie, ' + tradieName + ' is still spawning.');
            this.managers.tradie.request(c.REQUEST_RESCHEDULE, tradie);
            debug.unsetKey();
            return;
        }

        switch(tradie.memory.task) {
            case c.TASK_MOVE:
                debug.msg('Tradie is going to move.');
                this.move(tradie);
                break;
            case c.TASK_HARVEST:
                debug.msg('Tradie is going to harvest.');
                this.harvest(tradie);
                break;
            case c.TASK_BUILD:
                debug.msg('Tradie is going to build.');
                this.build(tradie);
                break;
            case c.TASK_RENEW:
                debug.msg('Tradie is going to renew.');
                this.renew(tradie);
                break;
            case c.TASK_IDLE:
            default:
                debug.msg('Tradie is idle.');
                this.managers.tradie.request(c.REQUEST_TASK, tradie);
        }

        this.managers.tradie.request(c.REQUEST_RESCHEDULE, tradie);
        debug.unsetKey();
    }

    renew(tradie) {
        debug.msg('Attempting to renew with spawn, ' + tradie.memory.target + '.');
        let spawn = Game.getObjectById(tradie.memory.target);

        if(!spawn) {
            debug.err('The spawn does not exist!');
            this.managers.tradie.request(c.REQUEST_TASK, tradie);
            return;
        }

        // TODO Set 0.9 to a constant in constants.js.
        if(tradie.ticksToLive > 0.9 * CREEP_LIFE_TIME
        && spawn.memory.task !== c.TASK_RENEW) {
            debug.msg('Tradie is renewed.');
            this.managers.tradie.request(c.REQUEST_TASK, tradie);
        }
        else if(spawn.memory.task === c.TASK_IDLE) {
            debug.msg('Requesting spawn to renew.');
            this.managers.spawn.request(c.REQUEST_RENEW, spawn);
        }
    }

    move(tradie) {
        let target = Game.getObjectById(tradie.memory.taskTarget);

        if(!target) {
            this.managers.tradie.request(c.REQUEST_JOB, tradie);
            return;
        }

        if(tradie.pos.isNearTo(target)) {
            this.managers.tradie.request(c.REQUEST_TASK, tradie);
            return;
        }

        tradie.moveTo(target);
    }

    harvest(tradie) {

        if(_.sum(tradie.carry) === tradie.carryCapacity) {
            this.managers.tradie.request(c.REQUEST_TASK, tradie);
            return;
        }

        let target = Game.getObjectById(tradie.memory.taskTarget);

        if(!target) {
            this.managers.tradie.request(c.REQUEST_TASK, tradie);
            return;
        }

        switch(tradie.harvest(target)) {
            case ERR_NOT_IN_RANGE:
                this.managers.tradie.request(c.REQUEST_TASK, tradie);
        }
    }

    build(tradie) {
        let target = Game.getObjectById(tradie.memory.taskTarget);

        // Check if target exists.
        if(!target) {
            this.managers.tradie.request(c.REQUEST_TASK, tradie);
            return;
        }

        // Check if target is a construction site.
        if(!target.progressTotal || target.progress === target.progressTotal) {
            let event = new EventTradie(tradie, target);
            this.managers.tradie.update(c.UPDATE_BUILD_COMPLETE, event);

            /* TODO
            this.managers.miner.update(c.UPDATE_CONTAINER_COMPLETE, event);
            this.managers.truck.update(c.UPDATE_CONTAINER_COMPLETE, event);
            */

            this.managers.tradie.request(c.REQUEST_TASK, tradie);
            return;
        }

        if(_.sum(tradie.carry) === 0) {
            this.managers.tradie.request(c.REQUEST_TASK, tradie);
            return;
        }

        switch(tradie.build(target)) {
            case ERR_NOT_IN_RANGE:
                this.managers.tradie.request(c.REQUEST_TASK, tradie);
        }
    }
};