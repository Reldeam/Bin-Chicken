if(!Game.memory.debug) Game.memory.debug = {
    global : true
};

/**
 * Debug allows the user to get messages, warning and errors
 * from the code. They can choose to see all messages coming
 * from everything or select specific 'keys' to turn on or off.
 *
 * A message/warning/error can be printed with a specific key.
 * A user can toggle these keys on/off which will show/hide
 * the messages with that key respectively.
 *
 * To turn on a key: require('debug').on(key)
 * To turn off a key: require('debug').off(key)
 *
 * To turn on/off all keys at once, just call on() or off()
 * without supplying a key.
 *
 * @type {module.Debug}
 */
module.exports = class Debug {

    static message(message, key = 'global') {
        if(Game.memory.debug[key]) {
            console.log('[MSG][' + key + ']: ' + message);
        }
    }

    static warning(warning, key = 'global') {
        if(Game.memory.debug[key]) {
            console.warn('[WRN][' + key + ']: ' + warning);
        }
    }

    static error(error, key = 'global') {
        if(Game.memory.debug[key]) {
            console.error('[ERR][' + key + ']: ' + error);
        }
    }

    static msg(message, key) { this.message(message, key); }
    static wrn(warning, key) { this.warning(warning, key); }
    static err(error, key) { this.error(error, key); }

    /**
     * Turn on a specific key or all of them if the key is
     * not given.
     *
     * @param key Key to turn on.
     */
    static on(key) {

        if(key === undefined) {
            for(key of Object.getOwnPropertyNames(Game.memory.debug)) {
                Game.memory.debug[key] = true;
            }
        }
        else {
            Game.memory.debug[key] = true;
        }

    }

    /**
     * Turn off a specific key or all of them if the key is
     * not given.
     *
     * @param key Key to turn off.
     */
    static off(key) {
        if(key === undefined) {
            for(key of Object.getOwnPropertyNames(Game.memory.debug)) {
                Game.memory.debug[key] = false;
            }
        }
        else {
            Game.memory.debug[key] = false;
        }
    }

    /**
     * Print all the available keys.
     */
    static keys() {
        for(let key of Object.getOwnPropertyNames(Game.memory.debug)) {
            console.log('-> ' + key + ' : ' + Game.memory.debug[key]);
        }
    }
};