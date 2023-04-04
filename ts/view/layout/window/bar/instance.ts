import * as Utils from "../../../../utils.js";
import * as Event from "../../../../event.js";

import * as Model from "../../../../model/layout/window/bar.js";

import * as Entity from "../../../entity.js";
import * as Window from "../instance.js";
import * as Title from "./title.js";
import * as Commands from "./commands.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            window,
        }: {
            model: () => Model.Instance;
            window: Window.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: window,
                event_grid: window.Event_Grid(),
            },
        );

        this.model = model;
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        this.Add_This_CSS(
            `
                .Bar {
                    display: grid;
                    grid-template-rows: auto;
                    grid-template-columns: 1fr auto;

                    width: 100%;
                    height: 100%;

                    overflow-x: hidden;
                    overflow-y: hidden;

                    border-color: white;
                    border-style: solid;
                    border-width: 0 0 1px 0;
                }
            `,
        );

        this.Add_Children_CSS(
            `
                .Title {
                    padding: 4px;

                    font-size: .8em;
                }

                .Commands {
                    display: grid;
                    grid-template-rows: auto;
                    grid-template-columns: 1fr 1fr 1fr;
                    justify-items: center;
                    justify-content: center;
                    align-items: center;
                    align-content: center;

                    width: 100%;
                    height: 100%;

                    overflow-x: hidden;
                    overflow-y: hidden;
                }

                .Button {
                    margin: 4px;

                    border-color: white;
                    border-style: solid;
                    border-width: 0;

                    cursor: pointer;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }
            `,
        );

        return [];
    }

    override On_Refresh():
        void
    {
        const model: Model.Instance = this.Model();

        if (
            !this.Has_Title() ||
            !this.Has_Commands()
        ) {
            this.Abort_All_Children();

            new Title.Instance(
                {
                    model: () => this.Model().Title(),
                    bar: this,
                },
            );
            new Commands.Instance(
                {
                    model: () => this.Model().Commands(),
                    bar: this,
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Bar`];
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Window():
        Window.Instance
    {
        return this.Parent() as Window.Instance;
    }

    Has_Title():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Title.Instance
        );
    }

    Title():
        Title.Instance
    {
        Utils.Assert(
            this.Has_Title(),
            `Does not have a title.`,
        );

        return this.Child(0) as Title.Instance;
    }

    Has_Commands():
        boolean
    {
        return (
            this.Has_Child(1) &&
            this.Child(1) instanceof Commands.Instance
        );
    }

    Commands():
        Commands.Instance
    {
        Utils.Assert(
            this.Has_Commands(),
            `Does not have commands.`,
        );

        return this.Child(1) as Commands.Instance;
    }
}
