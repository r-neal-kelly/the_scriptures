import * as Button from "./button.js";

export class Instance extends Button.Instance
{
    override Symbol():
        string
    {
        if (this.Commands().Bar().Window().Is_Maximized()) {
            return `v`;
        } else {
            return `^`;
        }
    }
}
