import * as Title from "./title.js";
import * as Commands from "./commands.js";
export class Instance {
    constructor({ window, }) {
        this.window = window;
        this.title = new Title.Instance({
            bar: this,
        });
        this.commands = new Commands.Instance({
            bar: this,
        });
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
