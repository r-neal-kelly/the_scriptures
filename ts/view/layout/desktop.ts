import * as Utils from "../../utils.js";
import * as Event from "../../event.js";

import * as Model from "../../model/layout/desktop.js";

import * as Entity from "../entity.js";
import * as Layout from "./instance.js";
import * as Wall from "./wall.js";
import * as Menu from "./menu.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            layout,
        }: {
            model: () => Model.Instance,
            layout: Layout.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: layout,
                event_grid: layout.Event_Grid(),
            },
        );

        this.model = model;

        this.Live();
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        this.Add_This_CSS(
            `
                .Desktop {
                    position: relative;

                    width: 100%;
                    height: 100%;

                    overflow-x: hidden;
                    overflow-y: hidden;
                    
                    background-position: center;
                    background-origin: border-box;
                    background-repeat: no-repeat;
                }

                @media (orientation: landscape) {
                    .Desktop {
                        background-size: 100% auto;
                    }
                }

                @media (orientation: portrait) {
                    .Desktop {
                        background-size: auto 100%;
                    }
                }
            `,
        );

        this.Add_Children_CSS(
            `
                .Wall {
                    display: grid;
                    
                    width: 100%;
                    height: 100%;

                    overflow-x: hidden;
                    overflow-y: hidden;
                }

                .Window {
                    display: grid;
                    grid-template-rows: auto 1fr;
                    grid-template-columns: auto;

                    width: 100%;
                    height: 100%;

                    overflow-x: auto;
                    overflow-y: auto;

                    border-color: white;
                    border-style: solid;
                    border-width: 1px;

                    background-color: hsl(0, 0%, 0%, 0.93);
                }

                .Minimized_Window {
                    display: none;
                }

                .Maximized_Window {
                    
                }

                .Menu {
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 100;

                    height: 100%;
                    padding: 0.5em 0;

                    background-color: hsl(0, 0%, 0%, 0.7);

                    border-color: white;
                    border-style: solid;
                    border-width: 1px 1px 0 1px;

                    overflow-y: auto;
                }

                .Open_Menu {

                }

                .Closed_Menu {
                    display: none;
                }

                .Open_Browser,
                .Open_Finder {
                    width: 100%;

                    margin-bottom: 7px;
                    padding: 5px;

                    background-color: hsl(0, 0%, 0%, 0.7);

                    border-color: white;
                    border-style: solid;
                    border-width: 1px 0;

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
        if (
            !this.Has_Wall() ||
            !this.Has_Menu()
        ) {
            this.Abort_All_Children();

            new Wall.Instance(
                {
                    model: () => this.Model().Wall(),
                    desktop: this,
                },
            );
            new Menu.Instance(
                {
                    model: () => this.Model().Menu(),
                    desktop: this,
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Desktop`];
    }

    override On_Restyle():
        string | { [index: string]: string; }
    {
        return `
            background-image: url(img/background/pexels-ksenia-chernaya-3952071.jpg);
            background-image: url(img/background/pexels-juan-pablo-serrano-arenas-877971.jpg);
        `;
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Layout():
        Layout.Instance
    {
        return this.Parent() as Layout.Instance;
    }

    Has_Wall():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Wall.Instance
        );
    }

    Wall():
        Wall.Instance
    {
        Utils.Assert(
            this.Has_Wall(),
            `Does not have a wall.`,
        );

        return this.Child(0) as Wall.Instance;
    }

    Has_Menu():
        boolean
    {
        return (
            this.Has_Child(1) &&
            this.Child(1) instanceof Menu.Instance
        );
    }

    Menu():
        Menu.Instance
    {
        Utils.Assert(
            this.Has_Menu(),
            `Does not have a menu.`,
        );

        return this.Child(1) as Menu.Instance;
    }
}
