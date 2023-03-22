import * as Utils from "./utils.js";
import * as Event from "./event.js";
import * as Entity from "./entity.js";

import * as Model from "./model/browser.js";
import * as View from "./view/browser.js";

class Body extends Entity.Instance
{
    private model: Model.Instance | null;
    private view: View.Instance | null;

    constructor()
    {
        super(document.body as HTMLBodyElement, new Event.Grid());

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

        this.Element().addEventListener(
            `click`,
            function (
                this: Body,
            ):
                void
            {
                this.Send(
                    new Event.Info(
                        {
                            affix: "Test",
                            suffixes: [],
                            type: Event.Type.IMMEDIATE,
                            data: {},
                        },
                    ),
                );
            }.bind(this),
        );

        return [
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(Event.Prefix.BEFORE, "Test"),
                    event_handler: () => console.log("before Infinity"),
                    event_priority: Infinity,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(Event.Prefix.BEFORE, "Test"),
                    event_handler: async function (
                        data: Event.Data,
                    ):
                        Promise<void>
                    {
                        console.log("before 3");
                        await Utils.Wait_Seconds(1);
                        console.log(Event.Instance.From(data));
                    },
                    event_priority: 3,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(Event.Prefix.BEFORE, "Test"),
                    event_handler: () => console.log("before 2"),
                    event_priority: 2,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(Event.Prefix.BEFORE, "Test"),
                    event_handler: () => console.log("before 1"),
                    event_priority: 1,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(Event.Prefix.BEFORE, "Test"),
                    event_handler: () => console.log("before -Infinity"),
                    event_priority: -Infinity,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(Event.Prefix.ON, "Test"),
                    event_handler: () => console.log("on 3"),
                    event_priority: 3,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(Event.Prefix.ON, "Test"),
                    event_handler: () => console.log("on 2"),
                    event_priority: 2,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(Event.Prefix.ON, "Test"),
                    event_handler: () => console.log("on 1"),
                    event_priority: 1,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(Event.Prefix.AFTER, "Test"),
                    event_handler: () => console.log("after 3"),
                    event_priority: 3,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(Event.Prefix.AFTER, "Test"),
                    event_handler: () => console.log("after 2"),
                    event_priority: 2,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(Event.Prefix.AFTER, "Test"),
                    event_handler: () => console.log("after 1"),
                    event_priority: 1,
                },
            ),
        ];
    }

    override async On_Refresh():
        Promise<void>
    {
        await this.Kill_All_Children();

        this.model = new Model.Instance();
        await this.model.Ready();

        this.view = new View.Instance(
            {
                model: this.model,
                root: this,
            },
        );

        this.Add_Child(this.view);
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
        super(`div`, new Event.Grid());
    }
}

class Lines extends Entity.Instance
{
    constructor()
    {
        super(`div`, new Event.Grid());
    }
}

class Line extends Entity.Instance
{
    constructor()
    {
        super(`div`, new Event.Grid());
    }
}

class Word extends Entity.Instance
{
    constructor()
    {
        super(`div`, new Event.Grid());
    }
}

class Letter extends Entity.Instance
{
    constructor()
    {
        super(`div`, new Event.Grid());
    }
}

class Break extends Entity.Instance
{
    constructor()
    {
        super(`div`, new Event.Grid());
    }
}

class Marker extends Entity.Instance
{
    constructor()
    {
        super(`div`, new Event.Grid());
    }
}
