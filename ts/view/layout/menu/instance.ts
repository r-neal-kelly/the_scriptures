import * as Utils from "../../../utils.js";
import * as Event from "../../../event.js";

import * as Model from "../../../model/layout/menu/instance.js";

import * as Events from "../../events.js";
import * as Entity from "../../entity.js";
import * as Desktop from "../desktop.js";
import * as Open_Browser from "./open_browser.js";
import * as Open_Finder from "./open_finder.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            desktop,
        }: {
            model: () => Model.Instance;
            desktop: Desktop.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: desktop,
                event_grid: desktop.Event_Grid(),
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

        return [
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.ON,
                        Events.MENU_OPEN,
                        this.Desktop().Layout().ID(),
                    ),
                    event_handler: this.On_Taskbar_Menu_Open,
                    event_priority: 0,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.AFTER,
                        Events.MENU_OPEN,
                        this.Desktop().Layout().ID(),
                    ),
                    event_handler: this.After_Taskbar_Menu_Open,
                    event_priority: 0,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.ON,
                        Events.MENU_CLOSE,
                        this.Desktop().Layout().ID(),
                    ),
                    event_handler: this.On_Taskbar_Menu_Close,
                    event_priority: 0,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.AFTER,
                        Events.MENU_CLOSE,
                        this.Desktop().Layout().ID(),
                    ),
                    event_handler: this.After_Taskbar_Menu_Close,
                    event_priority: 0,
                },
            ),
        ];
    }

    override On_Refresh():
        void
    {
        if (
            !this.Has_Open_Browser() ||
            !this.Has_Open_Finder()
        ) {
            this.Abort_All_Children();

            new Open_Browser.Instance(
                {
                    model: () => this.Model().Open_Browser(),
                    menu: this,
                },
            );
            new Open_Finder.Instance(
                {
                    model: () => this.Model().Open_Finder(),
                    menu: this,
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        const model: Model.Instance = this.Model();
        const classes: Array<string> = [];

        classes.push(`Menu`);
        if (model.Is_Open()) {
            classes.push(`Open_Menu`);
        } else {
            classes.push(`Closed_Menu`);
        }

        return classes;
    }

    private async On_Click(
        event: MouseEvent,
    ):
        Promise<void>
    {
        event.stopPropagation();
    }

    private async On_Taskbar_Menu_Open():
        Promise<void>
    {
        this.Model().Open();
    }

    private async After_Taskbar_Menu_Open():
        Promise<void>
    {
        this.Refresh();
    }

    private async On_Taskbar_Menu_Close():
        Promise<void>
    {
        this.Model().Close();
    }

    private async After_Taskbar_Menu_Close():
        Promise<void>
    {
        this.Refresh();
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Desktop():
        Desktop.Instance
    {
        return this.Parent() as Desktop.Instance;
    }

    Has_Open_Browser():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Open_Browser.Instance
        );
    }

    Open_Browser():
        Open_Browser.Instance
    {
        Utils.Assert(
            this.Has_Open_Browser(),
            `Does not have open_browser.`,
        );

        return this.Child(0) as Open_Browser.Instance;
    }

    Has_Open_Finder():
        boolean
    {
        return (
            this.Has_Child(1) &&
            this.Child(1) instanceof Open_Finder.Instance
        );
    }

    Open_Finder():
        Open_Finder.Instance
    {
        Utils.Assert(
            this.Has_Open_Finder(),
            `Does not have open_finder.`,
        );

        return this.Child(1) as Open_Finder.Instance;
    }

    async Animate_Button(
        button: Entity.Instance,
    ):
        Promise<void>
    {
        await button.Animate(
            [
                {
                    offset: 0.00,
                    backgroundColor: `black`,
                    color: `white`,
                },
                {
                    offset: 0.50,
                    backgroundColor: `white`,
                    color: `black`,
                },
                {
                    offset: 1.00,
                    backgroundColor: `black`,
                    color: `white`,
                },
            ],
            {
                duration: 200,
                easing: `ease`,
            },
        );
    }
}
