import * as Entity from "../../../entity.js";
import * as Title from "./title.js";
import * as Commands from "./commands.js";
export class Instance extends Entity.Instance {
    constructor({ window, }) {
        super();
        this.window = window;
        this.title = new Title.Instance({
            bar: this,
        });
        this.commands = new Commands.Instance({
            bar: this,
        });
        this.Add_Dependencies([
            this.title,
            this.commands,
        ]);
    }
    Window() {
        return this.window;
    }
    Title() {
        return this.title;
    }
    Commands() {
        return this.commands;
    }
}
