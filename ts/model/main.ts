import * as Layout from "./layout.js";

export class Instance
{
    private layout: Layout.Instance;

    constructor()
    {
        this.layout = new Layout.Instance();
    }

    Layout():
        Layout.Instance
    {
        return this.layout;
    }
}
