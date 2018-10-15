const Manager = require('Manager');
const SchedulerTask = require('SchedulerTask');
const c = require('constants');

module.exports = class ManagerTradie extends Manager 
{
    request(type, tradie) {
        switch(type) {
            case 'job':
                this.requestJob(tradie);
                break;
            case 'task':
                this.requestTask(tradie);
                break;
            case 'reschedule':
                this.reschedule(tradie);
                break;
        }
    }

    update(type, event) {
        switch(type) {
            case c.UPDATE_BUILD_COMPLETE:
                let site = Game.getObjectById(event.target);
                let room = site.room;

                let tradie;

                for(let name in room.memory.tradies) {
                    tradie = Game.creeps[name];
                    if(tradie.memory.jobTarget === event.target) {
                        this.requestJob(tradie);
                    }
                }
                break;
        }
    }

    requestJob(tradie) {
        let containers = tradie.room.find(FIND_CONSTRUCTION_SITES, {
            filter : {structureType : STRUCTURE_CONTAINER}
        });

        if(containers) {
            tradie.memory.job = c.BUILD;
            tradie.memory.jobTarget = containers[0].id;
        }

        this.requestTask(tradie);
    }

    requestTask(tradie) {
        let job = tradie.memory.job;

        switch(job) {
            case c.BUILD:
                this.nextBuildTask(tradie);
                break;
            default:
                this.requestJob(tradie);
        }
    }

    nextBuildTask(tradie) {
        let buildTarget = Game.getObjectById(tradie.memory.jobTarget);

        // Check if target exists.
        if(!buildTarget) {
            this.requestJob(tradie);
            return;
        }

        // Check if tradie needs to get resources.
        if(_.sum(tradie.carry) < tradie.carryCapacity) {
            let target = findEnergySupply(tradie);

            if(!target) {
                tradie.memory.task = c.IDLE;
                return;
            }

            tradie.memory.target = target.id;

            if(tradie.pos.isNearTo(target)) tradie.memory.task = c.HARVEST;
            else tradie.memory.task = c.MOVE;
        }

        // Check if tradie is next to the construction site.
        else if(tradie.pos.isNearTo(buildTarget)) {
            tradie.memory.task = c.BUILD;
            tradie.memory.target = buildTarget.id;
        }

        // Move tradie to the construction site.
        else {
            tradie.memory.task = c.MOVE;
            tradie.memory.target = buildTarget.id;
        }
    }

    reschedule(tradie) {
        let task = new SchedulerTask(c.TRADIE_CONTROLLER, tradie.name);
        this.scheduler.add(task);
    }
};

function findEnergySupply(tradie) {
    let source = tradie.pos.findClosestByPath(FIND_SOURCES);

    if(!source) return null;

    let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
        filter : {structureType : STRUCTURE_CONTAINER}
    });

    let container = containers[0];

    if(container && container.store[RESOURCE_ENERGY] > 0) return container;
    return source;
}