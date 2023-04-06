import * as Entity from "../../entity.js";
export class Instance extends Entity.Instance {
    constructor({ commander, is_activated, }) {
        super();
        this.commander = commander;
        this.is_activated = is_activated;
        this.Is_Ready_After([]);
    }
    Commander() {
        return this.commander;
    }
    Symbol() {
        if (this.Is_Activated()) {
            return `<`;
        }
        else {
            return `>`;
        }
    }
    Is_Activated() {
        return this.is_activated;
    }
    Is_Deactivated() {
        return !this.Is_Activated();
    }
    Activate() {
        this.is_activated = true;
    }
    Deactivate() {
        this.is_activated = false;
    }
    Toggle() {
        if (this.Is_Activated()) {
            this.Deactivate();
        }
        else {
            this.Activate();
        }
    }
}
