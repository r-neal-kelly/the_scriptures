import * as Utils from "../../utils.js";
import * as Event from "../../event.js";

import * as Model from "../../model/layout/instance.js";

import * as Events from "../events.js";
import * as Entity from "../entity.js";
import * as Desktop from "./desktop.js";
import * as Taskbar from "./taskbar.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            root,
        }: {
            model: () => Model.Instance,
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

        this.Live();
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        this.Element().addEventListener(
            `click`,
            this.On_Click.bind(this),
        );

        this.Add_This_CSS(
            `
                .Layout {
                    display: grid;
                    grid-template-rows: 1fr auto;
                    grid-template-columns: auto;

                    width: 100%;
                    height: 100%;

                    overflow-x: hidden;
                    overflow-y: hidden;

                    color: white;
                }
            `,
        );

        return [];
    }

    override On_Refresh():
        void
    {
        if (
            !this.Has_Desktop() ||
            !this.Has_Taskbar()
        ) {
            this.Abort_All_Children();

            new Desktop.Instance(
                {
                    model: () => this.Model().Desktop(),
                    layout: this,
                },
            );
            new Taskbar.Instance(
                {
                    model: () => this.Model().Taskbar(),
                    layout: this,
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Layout`];
    }

    private async On_Click(
        event: MouseEvent,
    ):
        Promise<void>
    {
        const model: Model.Instance = this.Model();

        if (model.Desktop().Menu().Is_Open()) {
            await this.Send(
                new Event.Info(
                    {
                        affix: Events.MENU_CLOSE,
                        suffixes: [
                            this.ID(),
                        ],
                        type: Event.Type.EXCLUSIVE,
                        data: {},
                    },
                ),
            );
        }
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Root():
        Entity.Instance
    {
        return this.Parent();
    }

    Has_Desktop():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Desktop.Instance
        );
    }

    Desktop():
        Desktop.Instance
    {
        Utils.Assert(
            this.Has_Desktop(),
            `Does not have a desktop.`,
        );

        return this.Child(0) as Desktop.Instance;
    }

    Has_Taskbar():
        boolean
    {
        return (
            this.Has_Child(1) &&
            this.Child(1) instanceof Taskbar.Instance
        );
    }

    Taskbar():
        Taskbar.Instance
    {
        Utils.Assert(
            this.Has_Taskbar(),
            `Does not have a taskbar.`,
        );

        return this.Child(1) as Taskbar.Instance;
    }
}
