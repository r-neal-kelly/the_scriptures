import * as Window from "../../window.js";
import * as Button from "./button.js";

export class Instance extends Button.Instance
{
    override Symbol():
        string
    {
        return `–`;
    }
}
