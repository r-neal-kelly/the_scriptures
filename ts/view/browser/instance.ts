import * as Utils from "../../utils.js";
import * as Entity from "../../entity.js";

import * as Model from "../../model/browser/instance.js";

import * as Selector from "./selector.js";
import * as Reader from "./reader.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;
    private selector: Selector.Instance | null;
    private reader: Reader.Instance | null;

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
        super(
            {
                element: `div`,
                parent: root,
                event_grid: root.Event_Grid(),
            },
        );

        this.model = model;
        this.selector = null;
        this.reader = null;
    }

    override On_Refresh():
        void
    {
        this.Abort_All_Children();

        this.selector = new Selector.Instance(
            {
                model: this.Model().Selector(),
                browser: this,
            },
        );
        this.reader = new Reader.Instance(
            {
                model: this.Model().Reader(),
                browser: this,
            },
        );
    }

    override On_Restyle():
        string
    {
        return `
            display: grid;
            grid-template-rows: 1fr;
            grid-template-columns: auto auto;
            justify-content: start;
        
            width: 100%;
            height: 100%;

            overflow-x: hidden;
            overflow-y: hidden;

            color: white;
        `;
    }

    Model():
        Model.Instance
    {
        return this.model;
    }

    Root():
        Entity.Instance
    {
        return this.Parent();
    }

    Selector():
        Selector.Instance
    {
        Utils.Assert(
            this.selector != null,
            `Does not have selector.`,
        );

        return this.selector as Selector.Instance;
    }

    Reader():
        Reader.Instance
    {
        Utils.Assert(
            this.reader != null,
            `Does not have reader.`,
        );

        return this.reader as Reader.Instance;
    }
}
