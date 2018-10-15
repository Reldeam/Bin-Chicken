const PriorityQueue = require('PriorityQueue');
const SchedulerTask = require('SchedulerTask');
const debug = require('debug');

const c = require('constants');
const controllers = require('controllers');

module.exports = class Scheduler extends PriorityQueue
{
    constructor() {
        super(SchedulerTask.compare);
        this.managers = require('managers')(this);
        this.controllers = require('controllers')(this.managers);
    }

    run() {
        debug.msg('Running scheduler...', 'scheduler');

        // Stats to prevent running too many tasks in one tick.
        let tasksRun = 0;
        let meanTaskTime = 0;

        let task, startTime, endTime, timeTaken, cpuLeft;

        while(this.hasNext()) {
            startTime = Game.cpu.getUsed();

            task = this.poll();
            if(task.time > Game.time) break;

            debug.msg('Started task ' + (tasksRun + 1) + '...', 'scheduler');
            this.next();

            switch(task.controller) {
                case c.ROOM_CONTROLLER:
                    this.controllers.room.run(task.entity);
                    break;
                case c.SPAWN_CONTROLLER:
                    this.controllers.spawn.run(task.entity);
                    break;
                case c.TRADIE_CONTROLLER:
                    this.controllers.tradie.run(task.entity);
                    break;
            }

            endTime = Game.cpu.getUsed();
            timeTaken = endTime - startTime;

            meanTaskTime *= tasksRun;
            meanTaskTime = (meanTaskTime + timeTaken) / ++tasksRun;

            debug.msg('Finished task ' + tasksRun + ' in ' + timeTaken + ' ms.', 'scheduler');

            cpuLeft = Game.cpu.limit - endTime;
            if(c.SCHEDULER_TASK_BUFFER * meanTaskTime > cpuLeft) break;
        }
    }

    load(json) {
        this.queue = json;
    }

    save() {
        Memory.scheduler = this.queue;
    }
};