import * as Utils from "../../utils.js";
export class Instance {
    constructor() {
        this.window_ids = [];
    }
    Has_Window_ID(window_id) {
        return this.window_ids.indexOf(window_id) > -1;
    }
    Add_Window_ID(window_id) {
        Utils.Assert(!this.Has_Window_ID(window_id), `Already has a window_id of ${window_id}.`);
        this.window_ids.push(window_id);
    }
    Remove_Window_ID(window_id) {
        const index = this.window_ids.indexOf(window_id);
        Utils.Assert(index > -1, `Does not have window_id ${window_id}.`);
        this.window_ids.splice(index, 1);
    }
}
