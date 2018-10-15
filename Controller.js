/**
 * A Controller controls one type of entity, i.e. A structure
 * or a tradie creep. The Controller calls the entity's
 * methods based on the memory state of the entity.
 *
 * Controllers are able to access game memory but are not
 * allowed to change the game memory. If a controller
 * wishes to change the memory state of an entity it must
 * make a request to a Manager.
 *
 * @type {module.Controller}
 */
module.exports = class Controller
{
    constructor(managers) {
        /* The controller has access to any managers given
         * to it. It is recommended to add all managers
         * via managers.js. */
        this.managers = managers;
    }

    /**
     * The Controller will call entity methods based on the
     * entity's current memory state and will request changes
     * to this memory state based on the outcomes of the
     * method calls.
     *
     * @param entity The entity to manipulate.
     */
    run(entity) {}
};