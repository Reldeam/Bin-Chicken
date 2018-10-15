module.exports = (managers) => {
    return {
        room : new (require('ControllerRoom'))(managers),
        spawn : new (require('ControllerSpawn'))(managers),
        tradie : new (require('ControllerTradie'))(managers)
    };
};