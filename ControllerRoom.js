const Controller = require('Controller');

const c = require('constants');

module.exports = class ControllerRoom extends Controller
{
    run(roomName) {
        let room = Game.rooms[roomName];

        switch(room.memory.task) {
            case c.BUILD_CONTAINERS:
                this.buildContainers(room);
                this.managers.room.request('task', room);
                break;
            case c.BUILD_ROADS:
                this.buildRoads(room);
                this.managers.room.request('task', room);
                break;
            case c.IDLE:
            default:
                this.managers.room.request('task', room);
        }

        this.managers.room.request('reschedule', room);
    }

    buildContainers(room) {
        let containers = room.controller.pos.findInRange(FIND_STRUCTURES, 1, {
                filter : {structureType : STRUCTURE_CONTAINER}
        });
        
        if(!containers.length) {
            let closestSource = room.controller.pos.findClosestByPath(FIND_SOURCES);
            let path = room.controller.pos.findPathTo(closestSource);
            room.createConstructionSite(path[0].x, path[0].y, STRUCTURE_CONTAINER);
        }
        
        let sources = room.find(FIND_SOURCES);

        for(let source of sources) {
            let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
                filter : {structureType : STRUCTURE_CONTAINER}
            });

            if(!containers.length) {
                let path = source.pos.findPathTo(room.controller);
                room.createConstructionSite(path[0].x, path[0].y, STRUCTURE_CONTAINER);
            }
        }
    }

    buildRoads(room) {
        let roadsComplete = true;
        let sources = room.find(FIND_SOURCES);
        for(let source of sources) {
            let path = source.pos.findPathTo(room.controller);
            for(let step of path) {
                if(room.lookForAt(LOOK_CONSTRUCTION_SITES, step.x, step.y)) continue;
                room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
                roadsComplete = false;
            }
        }
        room.memory.roadsComplete = roadsComplete;
    }
};