import * as Utils from "../utils.js";
import * as Event from "../event.js";
import * as Entity from "../entity.js";

import * as Model from "../model/browser.js";
import * as View from "./browser.js";

class Body extends Entity.Instance
{
    private model: Model.Instance | null;
    private view: View.Instance | null;

    constructor()
    {
        super(
            {
                element: document.body as HTMLBodyElement,
                parent: null,
                event_grid: new Event.Grid(),
            },
        );

        this.model = null;
        this.view = null;
    }

    override async On_Life():
        Promise<Array<Event.Listener_Info>>
    {
        Utils.Create_Style_Element(`
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }

            *:focus {
                outline: 0;
            }
            
            html, body {
                width: 100%;
                height: 100%;

                background-color: black;

                font-family: sans-serif;
            }

            span {
                display: inline-block;
            }

            .ITALIC {
                font-style: italic;
            }

            .BOLD {
                font-weight: bold;
            }

            .UNDERLINE {
                text-decoration: underline;
            }
            
            .SMALL_CAPS {
                font-variant: small-caps;
            }
        `);

        this.Window().addEventListener(
            `beforeunload`,
            async function (
                this: Body,
                event: BeforeUnloadEvent,
            ):
                Promise<void>
            {
                await this.Die();
            }.bind(this),
        );

        return [];
    }

    override async On_Refresh():
        Promise<void>
    {
        this.Abort_All_Children();

        this.model = new Model.Instance();
        await this.model.Ready();

        this.view = new View.Instance(
            {
                model: this.model,
                root: this,
            },
        );
    }

    Window():
        Window
    {
        return window;
    }

    Document():
        Document
    {
        return document;
    }

    View():
        View.Instance
    {
        Utils.Assert(
            this.view != null,
            `Does not have a view.`,
        );

        return this.view as View.Instance;
    }
}

new Body();

// these placeholder classes will be for the currently open file
// we'll also need classes for the tabs.
// the tabs will have rows, one for each: books, languages, versions, maybe even files.
// you can close a book and the languages and versions will auto update
class File extends Entity.Instance
{
    constructor()
    {
        super(
            {
                element: `div`,
                parent: null,
                event_grid: new Event.Grid(),
            },
        );
    }
}

class Lines extends Entity.Instance
{
    constructor()
    {
        super(
            {
                element: `div`,
                parent: null,
                event_grid: new Event.Grid(),
            },
        );
    }
}

class Line extends Entity.Instance
{
    constructor()
    {
        super(
            {
                element: `div`,
                parent: null,
                event_grid: new Event.Grid(),
            },
        );
    }
}

class Word extends Entity.Instance
{
    constructor()
    {
        super(
            {
                element: `span`,
                parent: null,
                event_grid: new Event.Grid(),
            },
        );
    }
}

class Letter extends Entity.Instance
{
    constructor()
    {
        super(
            {
                element: `span`,
                parent: null,
                event_grid: new Event.Grid(),
            },
        );
    }
}

class Break extends Entity.Instance
{
    constructor()
    {
        super(
            {
                element: `span`,
                parent: null,
                event_grid: new Event.Grid(),
            },
        );
    }
}

class Marker extends Entity.Instance
{
    constructor()
    {
        super(
            {
                element: `span`,
                parent: null,
                event_grid: new Event.Grid(),
            },
        );
    }
}
