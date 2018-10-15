module.exports = class PriorityQueue
{
    constructor(comparator) {
        this.comparator = comparator;
        this.queue = [];
    }

    add(item) {
        let added = false;
        for(let i = 0; i < this.size(); i++) {
            if(this.comparator(item, this.queue[i]) > 0) {
                this.queue.splice(i, 0, item);
                added = true;
                break;
            }
        }
        if(!added) this.queue.push(item);
    }

    remove(item) {
        let index = this.queue.indexOf(item);
        if(index > -1) this.queue.splice(index, 1);
    }

    next() {
        return this.queue.shift();
    }

    poll() {
        return this.queue[0];
    }

    size() {
        return this.queue.length;
    }

    hasNext() {
        return this.queue.length > 0;
    }
};