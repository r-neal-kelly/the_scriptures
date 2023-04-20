import * as Utils from "../../../utils.js";
import * as Event from "../../../event.js";

import * as Model from "../../../model/browser/commander.js";

import * as Entity from "../../entity.js";
import * as Browser from "../instance.js";
import * as Previous from "./previous.js";
import * as Selector from "./selector.js";
import * as Next from "./next.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            browser,
        }: {
            model: () => Model.Instance,
            browser: Browser.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: browser,
                event_grid: browser.Event_Grid(),
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
                .Commander {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    justify-items: center;
                    align-content: space-around;
                    align-items: center;

                    padding: 4px;

                    border-color: white;
                    border-style: solid;
                    border-width: 0 1px 0 0;

                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }
            `,
        );

        this.Add_Children_CSS(
            `
                .Commander_Previous {
                    width: 100%;

                    text-align: center;

                    cursor: pointer;
                }

                .Commander_Selector {
                    width: 100%;

                    text-align: center;

                    cursor: pointer;
                }

                .Commander_Next {
                    width: 100%;

                    text-align: center;

                    cursor: pointer;
                }
            `,
        );

        return [];
    }

    override On_Refresh():
        void
    {
        if (
            !this.Has_Previous() ||
            !this.Has_Selector() ||
            !this.Has_Next()
        ) {
            this.Abort_All_Children();

            new Previous.Instance(
                {
                    model: () => this.Model().Previous(),
                    commander: this,
                },
            );
            new Selector.Instance(
                {
                    model: () => this.Model().Selector(),
                    commander: this,
                },
            );
            new Next.Instance(
                {
                    model: () => this.Model().Next(),
                    commander: this,
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Commander`];
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Browser():
        Browser.Instance
    {
        return this.Parent() as Browser.Instance;
    }

    Has_Previous():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Previous.Instance
        );
    }

    Previous():
        Previous.Instance
    {
        Utils.Assert(
            this.Has_Previous(),
            `Doesn't have previous.`,
        );

        return this.Child(0) as Previous.Instance;
    }

    Has_Selector():
        boolean
    {
        return (
            this.Has_Child(1) &&
            this.Child(1) instanceof Selector.Instance
        );
    }

    Selector():
        Selector.Instance
    {
        Utils.Assert(
            this.Has_Selector(),
            `Doesn't have selector.`,
        );

        return this.Child(1) as Selector.Instance;
    }

    Has_Next():
        boolean
    {
        return (
            this.Has_Child(2) &&
            this.Child(2) instanceof Next.Instance
        );
    }

    Next():
        Next.Instance
    {
        Utils.Assert(
            this.Has_Next(),
            `Doesn't have next.`,
        );

        return this.Child(2) as Next.Instance;
    }
}
