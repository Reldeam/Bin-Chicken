const Event = require('Event');

module.exports = class EventTradie extends Event
{
    constructor(tradie, target) {
        super(tradie);
        this.tradie = tradie;
        this.target = target;
    }
};