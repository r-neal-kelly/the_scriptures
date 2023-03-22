export class Instance {
    constructor({ slot, index, name, }) {
        this.slot = slot;
        this.index = index;
        this.name = name;
    }
    Slot() {
        return this.slot;
    }
    Index() {
        return this.index;
    }
    Name() {
        return this.name;
    }
}
