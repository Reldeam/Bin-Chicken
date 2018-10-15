const Controller = require('Controller');

const c = require('constants');

module.exports = class ControllerSpawn extends Controller
{
    run(spawnName) {
        let spawn = Game.spawns[spawnName];

        switch(spawn.memory.task) {
            case c.SPAWN_TRADIE:
                this.spawnTradie(spawn);
                break;
            case c.TASK_RENEW:
                this.renewCreep(spawn);
                break;
            case c.IDLE:
            default:
                this.managers.spawn.request('task', spawn);
                break;
        }

        this.managers.spawn.request('reschedule', spawn);
    }

    renewCreep(spawn) {
        let creep = Game.creeps[spawn.memory.taskTarget];
        if(!creep) {
            this.managers.spawn.request(c.REQUEST_TASK, spawn);
            return;
        }

        switch(spawn.renew(creep)) {
            case ERR_NOT_IN_RANGE:
            case ERR_INVALID_TARGET:
            case ERR_FULL:
                this.managers.spawn.request(c.REQUEST_TASK, spawn);
                break;
        }
    }

    spawnTradie(spawn) {
        let energyAvailable = spawn.room.energyAvailable;

        let energyPerLevel = 0;
        for(let part of Object.getOwnPropertyNames(c.TRADIE_BLUEPRINT.ratio)) {
            energyPerLevel += BODYPART_COST[part] * c.TRADIE_BLUEPRINT.ratio[part];
        }

        let minEnergy = c.TRADIE_BLUEPRINT.minLevel * energyPerLevel;

        if(minEnergy > energyAvailable) return;

        let level = Math.floor(energyAvailable / minEnergy);
        if(level > c.TRADIE_BLUEPRINT.maxLevel) level = c.TRADIE_BLUEPRINT.maxLevel;

        let body = [];

        for(let partType of c.TRADIE_BLUEPRINT.order) {
            let ratio = c.TRADIE_BLUEPRINT.ratio[partType];
            for(let i = 0; i < ratio * level; i++) body.push(partType);
        }

        let name = generateCreepName();
        while(Game.creeps[name]) name = generateCreepName();

        spawn.spawnCreep(body, name);

        let tradie = Game.creeps[name];

        if(tradie) {
            if(!spawn.room.memory.tradies) spawn.room.memory.tradies = [];
            spawn.room.memory.tradies.push(name);
            this.managers.tradie.request('reschedule', tradie);
            this.managers.spawn.request('task', spawn);
        }

    }
};

function generateCreepName() {
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let name = '';

    for(let i = 0; i < c.CREEP_NAME_LENGTH; i++) {
        name += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }

    return name;
}