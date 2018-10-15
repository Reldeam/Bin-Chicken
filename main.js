/**
 * Bin Chicken - Screep AI
 * By Reldeam
 *
 * Designed to optimise space over time with the goal of having
 * a completely automatic agent that is capable of running over
 * 40 rooms on a non-subscriber account.
 */

const c = require('constants');
const SchedularTask = require('SchedulerTask');

const Scheduler = require('Scheduler');
const scheduler = new Scheduler;

// Initialise on first-time run or load from memory.
if(!Memory.scheduler) init();
else scheduler.load(Memory.scheduler);

/**
 * The main loop. There is no way to know how many times this will
 * loop before a 'refresh' and so it must be assumed that a restart could
 * happen at any time.
 */
module.exports.loop = () => {
    scheduler.run();
    scheduler.save();
};

/**
 * Initialisation of AI. This method will be called once when starting
 * a new game or when using Bin Chicken for the first time.
 */
function init() {

    for(let room of Object.getOwnPropertyNames(Game.rooms)) {
        scheduler.add(new SchedularTask(c.ROOM_CONTROLLER, room));
    }

    for(let spawn of Object.getOwnPropertyNames(Game.spawns)) {
        scheduler.add(new SchedularTask(c.SPAWN_CONTROLLER, spawn));
    }

    scheduler.save();
}
