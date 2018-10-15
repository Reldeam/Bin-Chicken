module.exports = (scheduler) => {
    return {
        room : new (require('ManagerRoom'))(scheduler),
        spawn : new (require('ManagerSpawn'))(scheduler),
        tradie : new (require('ManagerTradie'))(scheduler)
    };
};