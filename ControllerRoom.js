const Controller = require('Controller');
const c = require('constants');

const debug = require('debug');
const debugKey = 'CTR Room';
debug.addKey(debugKey);

module.exports = class ControllerRoom extends Controller
{
    run(roomName) {
        debug.setKey(debugKey);
        debug.msg('Running room controller for, ' + roomName + '...');
        let room = Game.rooms[roomName];

        switch(room.memory.task) {
            case c.BUILD_CONTAINERS:
                debug.msg('Building containers.');
                this.buildContainers(room);
                this.managers.room.request('task', room);
                break;
            case c.BUILD_ROADS:
                debug.msg('Building roads.');
                this.buildRoads(room);
                this.managers.room.request('task', room);
                break;
            case c.IDLE:
            default:
                debug.msg('Idling.');
                this.managers.room.request('task', room);
        }

        this.managers.room.request('reschedule', room);
        debug.unsetKey();
    }

    buildContainers(room) {
        // Check how many new sites we can make.
        let sites = room.find(FIND_CONSTRUCTION_SITES);
        let maxNewSites = c.MAX_CONSTRUCTION_SITES_PER_ROOM - sites.length;
        if(maxNewSites < 1) return;

        // Add a container next to the controller.
        let containers = room.controller.pos.findInRange(FIND_STRUCTURES, 1, {
            filter : {structureType : STRUCTURE_CONTAINER}
        });
        if(!containers.length) {
            let closestSource = room.controller.pos.findClosestByPath(FIND_SOURCES);
            let path = room.controller.pos.findPathTo(closestSource);
            room.createConstructionSite(path[0].x, path[0].y, STRUCTURE_CONTAINER);

        }

        // Add containers next to all the sources.
        let sources = room.find(FIND_SOURCES);
        for(let source of sources) {
            let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
                filter : {structureType : STRUCTURE_CONTAINER}
            });

            if(!containers.length) {
                let path = source.pos.findPathTo(room.controller);
                room.createConstructionSite(path[0].x, path[0].y, STRUCTURE_CONTAINER);
                if(--maxNewSites < 1) break;
            }
        }
    }

    buildRoads(room) {
        // Check how many new sites we can make.
        let sites = room.find(FIND_CONSTRUCTION_SITES);
        let maxNewSites = c.MAX_CONSTRUCTION_SITES_PER_ROOM - sites.length;
        if(maxNewSites < 1) return;

        // Flag to check if we added any new roads.
        let roadsComplete = true;

        // Build roads from all the sources to the controller.
        let sources = room.find(FIND_SOURCES);
        for(let source of sources) {
            let path = source.pos.findPathTo(room.controller);
            for(let step of path) {
                if(room.lookForAt(LOOK_CONSTRUCTION_SITES, step.x, step.y)) continue;
                room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
                roadsComplete = false;
                if(--maxNewSites < 1) break;
            }
        }

        // If no roads were added then the roads are complete.
        room.memory.roadsComplete = roadsComplete;
    }
};