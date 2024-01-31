import * as Utils from "../utils.js";
import * as Event from "../event.js";

import * as Model from "../model/main.js";
import * as Data_Model from "../model/data.js";
import * as Fonts_Model from "../model/fonts.js";

import * as Entity from "./entity.js";
import * as Layout from "./layout.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;

    constructor(
        {
            model,
        }: {
            model: Model.Instance,
        },
    )
    {
        super(
            {
                element: document.body as HTMLBodyElement,
                parent: null,
                event_grid: new Event.Grid(),
            },
        );

        this.model = model;

        this.Live();
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        Utils.Create_Style_Element(
            Fonts_Model.Singleton().CSS_Definitions(),
        );

        this.Add_CSS(
            `
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                *:focus {
                    outline: 0;
                }
            `,
        );

        this.Add_This_CSS(
            `
                .Body {
                    position: relative;
                    
                    width: 100vw;
                    height: 100vh;

                    background-color: black;

                    font-family: sans-serif;
                    font-size: ${Data_Model.Consts.DEFAULT_UNDERLYING_FONT_SIZE_PX}px;
                }
            `,
        );

        this.Automatically_Resize();

        this.Window().addEventListener(
            `beforeunload`,
            function (
                this: Instance,
                event: BeforeUnloadEvent,
            ):
                void
            {
                this.Die();
            }.bind(this),
        );

        return [];
    }

    override On_Refresh():
        void
    {
        if (!this.Has_Layout()) {
            this.Abort_All_Children();

            new Layout.Instance(
                {
                    model: () => this.Model().Layout(),
                    root: this,
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Body`];
    }

    Model():
        Model.Instance
    {
        return this.model;
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

    Has_Layout():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Layout.Instance
        );
    }

    Layout():
        Layout.Instance
    {
        Utils.Assert(
            this.Has_Layout(),
            `Does not have a layout.`,
        );

        return this.Child(0) as Layout.Instance;
    }
}
