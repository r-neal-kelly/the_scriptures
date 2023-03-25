import * as Command from "./command.js";
export class Instance {
    constructor({ text, index, value, }) {
        this.text = text;
        this.index = index;
        this.value = value;
        this.parts = [];
        this.points = [];
        this.centered = value.slice(0, Command.Value.CENTER.length) === Command.Value.CENTER;
        // I think the idea is that we should go ahead and create parts and points in one loop
        // although if it's too convoluted we can just do two loops
    }
    Text() {
        return this.text;
    }
    Index() {
        return this.index;
    }
    Value() {
        return this.value;
    }
    Parts() {
        return Array.from(this.parts);
    }
    Points() {
        return Array.from(this.points);
    }
    Centered() {
        return this.centered;
    }
}
