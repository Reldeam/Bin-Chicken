const Manager = require('Manager');
const SchedulerTask = require('SchedulerTask');
const c = require('constants');

/**
 *
 * @type {module.ManagerTradie}
 *
 * Memory
 *
 * - job (String) Which job the tradie is currently doing.
 * - task (String) Which task the tradie is currently doing.
 * - jobTarget (String) The target of the job, i.e. if the
 *   job is to build then then jobTarget will be the
 *   construction site id that the creep is building.
 * - taskTarget (String) The target of the task, i.e. if the
 *   job is to build but the tradie is currently getting
 *   energy then the target may be a container or source id.
 *
 */
module.exports = class ManagerTradie extends Manager 
{
    request(type, tradie) {
        switch(type) {
            case c.REQUEST_JOB:
                this.requestJob(tradie);
                break;
            case c.REQUEST_TASK:
                this.requestTask(tradie);
                break;
            case c.REQUEST_RESCHEDULE:
                this.reschedule(tradie);
                break;
            case c.REQUEST_REMOVE:
                this.remove(tradie);
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

        let containersNearSources = _.remove(containers, (container) => {
            return container.pos.findInRange(FIND_SOURCES, 1).length;
        });

        if(containersNearSources.length) {
            tradie.memory.job = c.BUILD;
            tradie.memory.jobTarget = containersNearSources[0].id;
        }
        else if(containers.length) {
            tradie.memory.job = c.BUILD;
            tradie.memory.jobTarget = containers[0].id;
        }

        this.requestTask(tradie);
    }

    requestTask(tradie) {

        // Check if tradie needs to be renewed.
        if(this.requiresRenew(tradie)) {

            // Find closest spawn.
            let spawn = tradie.pos.findClosestByPath(FIND_STRUCTURES, {
               filter : {
                   structureType : STRUCTURE_SPAWN,
                   my : true
               }
            });

            if(spawn) {
                tradie.memory.taskTarget = spawn.id;
                if(tradie.pos.isNearTo(spawn)) {
                    tradie.memory.task = c.TASK_RENEW;
                }
                else {
                    tradie.memory.task = c.TASK_MOVE;
                }
                return;
            }
        }

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

            tradie.memory.taskTarget = target.id;

            if(tradie.pos.isNearTo(target)) tradie.memory.task = c.HARVEST;
            else tradie.memory.task = c.MOVE;
        }

        // Check if tradie is next to the construction site.
        else if(tradie.pos.isNearTo(buildTarget)) {
            tradie.memory.task = c.BUILD;
            tradie.memory.taskTarget = buildTarget.id;
        }

        // Move tradie to the construction site.
        else {
            tradie.memory.task = c.MOVE;
            tradie.memory.taskTarget = buildTarget.id;
        }
    }

    reschedule(tradie) {
        let task = new SchedulerTask(c.TRADIE_CONTROLLER, tradie.name);
        this.scheduler.add(task);
    }

    remove(tradie) {
        delete Memory.creeps[tradie];

        // Remove all tradie from room memory.
        // TODO Work out a way to make this way cleaner...
        for(let room of Game.rooms) {
            _.remove(room.memory.tradies, (creep) => {
                return creep === tradie;
            });
        }
    }

    requiresRenew(tradie) {
        // Find closest spawn.
        let spawn = tradie.pos.findClosestByPath(FIND_STRUCTURES, {
            filter : {
                structureType : STRUCTURE_SPAWN,
                my : true
            }
        });
        if(!spawn) return false;

        let path = tradie.pos.findPathTo(spawn);
        if(!path) return false;

        // TODO Set 2 to be a constant.
        return(tradie.ticksToLive / 2 < path.length);
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