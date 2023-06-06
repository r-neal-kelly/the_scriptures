import * as Utils from "../../../utils.js";
import * as Event from "../../../event.js";

import * as Model from "../../../model/browser/commander.js";

import * as Entity from "../../entity.js";
import * as Browser from "../instance.js";
import * as Allow_Errors from "./allow_errors.js";
import * as Font_Selector from "./font_selector.js";
import * as Previous from "./previous.js";
import * as Selector from "./selector.js";
import * as Next from "./next.js";

enum Child_Index
{
    ALLOW_ERRORS,
    FONT_SELECTOR,
    PREVIOUS,
    SELECTOR,
    NEXT,
}

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
                .Commander_Allow_Errors {
                    width: 100%;

                    text-align: center;

                    cursor: pointer;
                }
                
                .Commander_Font_Selector {
                    width: 100%;

                    text-align: center;

                    cursor: pointer;
                }

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
            !this.Has_Allow_Errors() ||
            !this.Has_Font_Selector() ||
            !this.Has_Previous() ||
            !this.Has_Selector() ||
            !this.Has_Next()
        ) {
            this.Abort_All_Children();

            new Allow_Errors.Instance(
                {
                    model: () => this.Model().Allow_Errors(),
                    commander: this,
                },
            );
            new Font_Selector.Instance(
                {
                    model: () => this.Model().Font_Selector(),
                    commander: this,
                },
            );
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

    Has_Allow_Errors():
        boolean
    {
        return (
            this.Has_Child(Child_Index.ALLOW_ERRORS) &&
            this.Child(Child_Index.ALLOW_ERRORS) instanceof Allow_Errors.Instance
        );
    }

    Allow_Errors():
        Allow_Errors.Instance
    {
        Utils.Assert(
            this.Has_Allow_Errors(),
            `Doesn't have allow_errors.`,
        );

        return this.Child(Child_Index.ALLOW_ERRORS) as Allow_Errors.Instance;
    }

    Has_Font_Selector():
        boolean
    {
        return (
            this.Has_Child(Child_Index.FONT_SELECTOR) &&
            this.Child(Child_Index.FONT_SELECTOR) instanceof Font_Selector.Instance
        );
    }

    Allow_Font_Selector():
        Font_Selector.Instance
    {
        Utils.Assert(
            this.Has_Font_Selector(),
            `Doesn't have font_selector.`,
        );

        return this.Child(Child_Index.FONT_SELECTOR) as Font_Selector.Instance;
    }

    Has_Previous():
        boolean
    {
        return (
            this.Has_Child(Child_Index.PREVIOUS) &&
            this.Child(Child_Index.PREVIOUS) instanceof Previous.Instance
        );
    }

    Previous():
        Previous.Instance
    {
        Utils.Assert(
            this.Has_Previous(),
            `Doesn't have previous.`,
        );

        return this.Child(Child_Index.PREVIOUS) as Previous.Instance;
    }

    Has_Selector():
        boolean
    {
        return (
            this.Has_Child(Child_Index.SELECTOR) &&
            this.Child(Child_Index.SELECTOR) instanceof Selector.Instance
        );
    }

    Selector():
        Selector.Instance
    {
        Utils.Assert(
            this.Has_Selector(),
            `Doesn't have selector.`,
        );

        return this.Child(Child_Index.SELECTOR) as Selector.Instance;
    }

    Has_Next():
        boolean
    {
        return (
            this.Has_Child(Child_Index.NEXT) &&
            this.Child(Child_Index.NEXT) instanceof Next.Instance
        );
    }

    Next():
        Next.Instance
    {
        Utils.Assert(
            this.Has_Next(),
            `Doesn't have next.`,
        );

        return this.Child(Child_Index.NEXT) as Next.Instance;
    }
}
