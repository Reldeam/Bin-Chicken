module.exports = {
    SCHEDULER_TASK_BUFFER: 4,

    ROOM_CONTROLLER: 'room controller',
    SPAWN_CONTROLLER: 'spawn controller',
    TRADIE_CONTROLLER: 'tradie controller',

    LOW_PRIORITY: -1,
    HIGH_PRIORITY: 1,

    BUILD: 'build',
    BUILD_CONTAINERS : 'build containers',
    BUILD_ROADS : 'build roads',
    HARVEST : 'harvest',
    IDLE : 'idle',
    MOVE: 'move',
    RECYCLE : 'recycle',
    RENEW : 'renew',
    SPAWN_TRADIE : 'spawn tradie',

    JOB_BUILD: 'build',

    TASK_BUILD: 'build',
    TASK_BUILD_CONTAINERS : 'build containers',
    TASK_BUILD_ROADS : 'build roads',
    TASK_HARVEST : 'harvest',
    TASK_IDLE : 'idle',
    TASK_MOVE: 'move',
    TASK_RECYCLE : 'recycle',
    TASK_RENEW : 'renew',
    TASK_SPAWN_TRADIE : 'spawn tradie',

    UPDATE_BUILD_COMPLETE : 'build complete',

    REQUEST_JOB: 'job',
    REQUEST_TASK : 'task',
    REQUEST_RESCHEDULE : 'reschedule',
    REQUEST_REMOVE : 'remove',

    CREEP_NAME_LENGTH : 6,

    MAX_CONSTRUCTION_SITES_PER_ROOM : 3,
    MAX_CONSTRUCTION_SITES : 100,

    MAX_TRADIES_PER_ROOM : 3,

    TRADIE_BLUEPRINT : {
        ratio : {
            work : 1,
            carry : 1,
            move : 2
        },
        order : ['work', 'carry', 'move'],
        minLevel : 1,
        maxLevel : 3
    }
};