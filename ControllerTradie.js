const Controller = require('Controller');
const EventTradie = require('EventTradie');
const c = require('constants');

module.exports = class ControllerTradie extends Controller
{
    run(tradieName) {
        let tradie = Game.creeps[tradieName];

        if(tradie.spawning) {
            this.managers.tradie.request(c.REQUEST_RESCHEDULE, tradie);
            return;
        }

        switch(tradie.memory.task) {
            case c.MOVE:
                this.move(tradie);
                break;
            case c.HARVEST:
                this.harvest(tradie);
                break;
            case c.BUILD:
                this.build(tradie);
                break;
            case c.IDLE:
            default:
                this.managers.tradie.request(c.REQUEST_TASK, tradie);
        }

        this.managers.tradie.request(c.REQUEST_RESCHEDULE, tradie);
    }

    move(tradie) {
        let target = Game.getObjectById(tradie.memory.target);

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

        let target = Game.getObjectById(tradie.memory.target);

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
        let target = Game.getObjectById(tradie.memory.target);

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