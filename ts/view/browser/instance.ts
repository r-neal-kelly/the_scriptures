import * as Utils from "../../utils.js";
import * as Entity from "../../entity.js";

import * as Model from "../../model/browser/instance.js";

import * as Books from "./books.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;
    private root: Entity.Instance;
    private books: Books.Instance | null;

    constructor(
        {
            model,
            root,
        }: {
            model: Model.Instance,
            root: Entity.Instance,
        },
    )
    {
        super(`div`, root.Event_Grid());

        this.model = model;
        this.root = root;
        this.books = null;
    }

    override async On_Restyle():
        Promise<Entity.Styles>
    {
        return ({
            "display": `grid`,

            "width": `100%`,
            "height": `100%`,

            "overflow-x": `auto`, // temp, should be hidden
            "overflow-y": `auto`, // ""

            "color": `white`,
        });
    }

    override async On_Refresh():
        Promise<void>
    {
        await this.Kill_All_Children();

        this.books = new Books.Instance(
            {
                model: this.Model().Books(),
                browser: this,
            },
        );
        this.Add_Child(this.books);
    }

    Model():
        Model.Instance
    {
        return this.model;
    }

    Root():
        Entity.Instance
    {
        return this.root;
    }

    Books():
        Books.Instance
    {
        Utils.Assert(
            this.books != null,
            `Does not have books.`,
        );

        return this.books as Books.Instance;
    }
}
