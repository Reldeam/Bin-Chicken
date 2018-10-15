const Controller = require('Controller');
const c = require('constants');

module.exports = class ControllerTradie extends Controller
{
    run(tradieName) {
        let tradie = Game.creeps[tradieName];

        if(tradie.spawning) {
            this.managers.tradie.request('reschedule', tradie);
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
                this.managers.tradie.request('task', tradie);
        }

        this.managers.tradie.request('reschedule', tradie);
    }

    move(tradie) {
        let target = Game.getObjectById(tradie.memory.target);

        if(!target) {
            this.managers.tradie.request('job', tradie);
            return;
        }

        if(tradie.pos.isNearTo(target)) {
            this.managers.tradie.request('task', tradie);
            return;
        }

        tradie.moveTo(target);
    }

    harvest(tradie) {

        if(_.sum(tradie.carry) === tradie.carryCapacity) {
            this.managers.tradie.request('task', tradie);
            return;
        }

        let target = Game.getObjectById(tradie.memory.target);

        if(!target) {
            this.managers.tradie.request('task', tradie);
            return;
        }

        switch(tradie.harvest(target)) {
            case ERR_NOT_IN_RANGE:
                this.managers.tradie.request('task', tradie);
        }
    }

    build(tradie) {
        let target = Game.getObjectById(tradie.memory.target);

        if(!target) {
            this.managers.tradie.request('task', tradie);
            return;
        }

        if(!target.progressTotal || target.progress === target.progressTotal) {
            this.managers.tradie.request('job', tradie);
            return;
        }

        if(_.sum(tradie.carry) === 0) {
            this.managers.tradie.request('task', tradie);
            return;
        }

        switch(tradie.build(target)) {
            case ERR_NOT_IN_RANGE:
                this.managers.tradie.request('task', tradie);
        }
    }
};