import * as Entity from "../entity.js";
import * as Window from "./window.js";
export class Instance extends Entity.Instance {
    constructor({ model, layout, }) {
        super({
            element: `div`,
            parent: layout,
            event_grid: layout.Event_Grid(),
        });
        this.model = model;
    }
    On_Refresh() {
        const model = this.Model();
        const target = model.Count();
        const count = this.Child_Count();
        const delta = target - count;
        if (delta < 0) {
            for (let idx = count, end = count + delta; idx > end;) {
                idx -= 1;
                this.Abort_Child(this.Child(idx));
            }
        }
        else if (delta > 0) {
            for (let idx = count, end = count + delta; idx < end; idx += 1) {
                new Window.Instance({
                    model: () => this.Model().At(idx),
                    wall: this,
                });
            }
        }
    }
    On_Reclass() {
        return [`Wall`];
    }
    On_Restyle() {
        // This is just dumb logic, but I want something working
        // and my brain is having a hard time cooperating. I
        // can barely get this right.
        const model = this.Model();
        const window_count = model.Count();
        if (window_count === 1) {
            return `
                grid-template-columns: repeat(1, 1fr);
                grid-template-rows: repeat(1, 1fr);
            `;
        }
        else if (window_count === 2) {
            return `
                grid-template-columns: repeat(2, 1fr);
                grid-template-rows: repeat(1, 1fr);
            `;
        }
        else if (window_count === 3) {
            return `
                grid-template-columns: repeat(2, 1fr);
                grid-template-rows: repeat(2, 1fr);
            `;
        }
        else if (window_count === 4) {
            return `
                grid-template-columns: repeat(2, 1fr);
                grid-template-rows: repeat(2, 1fr);
            `;
        }
        else if (window_count === 5) {
            return `
                grid-template-columns: repeat(3, 1fr);
                grid-template-rows: repeat(2, 1fr);
            `;
        }
        else if (window_count === 6) {
            return `
                grid-template-columns: repeat(3, 1fr);
                grid-template-rows: repeat(2, 1fr);
            `;
        }
        else {
            return `
                grid-template-columns: auto;
                grid-template-rows: auto;
            `;
        }
    }
    Model() {
        return this.model();
    }
    Layout() {
        return this.Parent();
    }
}
