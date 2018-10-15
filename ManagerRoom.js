const Manager = require('Manager');
const SchedulerTask = require('SchedulerTask');

const c = require('constants');

module.exports = class ManagerRoom extends Manager
{
    request(type, room) {
        switch(type) {
            case 'task':
                this.requestTask(room);
                break;
            case 'reschedule':
                this.reschedule(room);
                break;
        }
    }

    requestTask(room) {
        let controller = room.controller;


        if(!controller.my) {
            //TODO Do something if room not owned by me.
        }

        switch(controller.level) {
            case 8:
            case 7:
            case 6:
            case 5:
            case 4:
            case 3:
            case 2:
            case 1:
            case 0:
                if(containersNeeded(room)) room.memory.task = c.BUILD_CONTAINERS;
                else if(roadsNeeded(room)) room.memory.task = c.BUILD_ROADS;
                else room.memory.task = c.IDLE;
        }
    }

    reschedule(room) {
        let task = new SchedulerTask(c.ROOM_CONTROLLER, room.name);
        this.scheduler.add(task);
    }
};

function containersNeeded(room) {
    let sources = room.find(FIND_SOURCES);
    let containers = room.find(FIND_STRUCTURES, {
       filter : {structureType : STRUCTURE_CONTAINER}
    });
    let constructionSites = room.find(FIND_CONSTRUCTION_SITES, {
       filter : {structureType : STRUCTURE_CONTAINER}
    });

    return(containers.length + constructionSites.length < sources.length + 1);
}

function roadsNeeded(room) {
    return !room.memory.roadsComplete;
}