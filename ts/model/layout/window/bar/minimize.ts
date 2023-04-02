import * as Button from "./button.js";

export class Instance extends Button.Instance
{
    override Symbol():
        string
    {
        return `–`;
    }

    override async Click():
        Promise<void>
    {
        this.Commands().Bar().Window().Toggle_Minimization();
    }
}
