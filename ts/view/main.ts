import * as Utils from "../utils.js";
import * as Event from "../event.js";
import * as Entity from "../entity.js";

import * as Model from "../model/layout.js";
import * as View from "./layout.js";

import * as Browser_Model from "../model/browser.js";
import * as Browser_View from "./browser.js";

class Body extends Entity.Instance
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
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
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
                    width: 100vw;
                    height: 100vh;

                    background-color: black;

                    font-family: sans-serif;
                }
            `,
        );

        this.Window().addEventListener(
            `beforeunload`,
            function (
                this: Body,
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
        if (!this.Has_View()) {
            this.Abort_All_Children();

            new View.Instance(
                {
                    model: () => this.Model(),
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

    Has_View():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof View.Instance
        );
    }

    View():
        View.Instance
    {
        Utils.Assert(
            this.Has_View(),
            `Does not have a view.`,
        );

        return this.Child(0) as View.Instance;
    }
}

async function Main():
    Promise<void>
{
    const model: Model.Instance = new Model.Instance();

    // Once we set up our save file structure, or at least prototype it,
    // we'll pull each window's model's data from there and pass it along.
    await Promise.all(
        [
            model.Add_Window(
                {
                    model_class: Browser_Model.Instance,
                    view_class: Browser_View.Instance,
                    model_data: {
                        selector_slot_order:
                            Browser_Model.Selector.Slot.Order.BOOKS_LANGUAGES_VERSIONS,
                    },
                },
            ),
            model.Add_Window(
                {
                    model_class: Browser_Model.Instance,
                    view_class: Browser_View.Instance,
                    model_data: {
                        selector_slot_order:
                            Browser_Model.Selector.Slot.Order.BOOKS_VERSIONS_LANGUAGES,
                    },
                },
            ),
            model.Add_Window(
                {
                    model_class: Browser_Model.Instance,
                    view_class: Browser_View.Instance,
                    model_data: {
                        selector_slot_order:
                            Browser_Model.Selector.Slot.Order.LANGUAGES_BOOKS_VERSIONS,
                    },
                },
            ),
            model.Add_Window(
                {
                    model_class: Browser_Model.Instance,
                    view_class: Browser_View.Instance,
                    model_data: {
                        selector_slot_order:
                            Browser_Model.Selector.Slot.Order.LANGUAGES_VERSIONS_BOOKS,
                    },
                },
            ),
            model.Add_Window(
                {
                    model_class: Browser_Model.Instance,
                    view_class: Browser_View.Instance,
                    model_data: {
                        selector_slot_order:
                            Browser_Model.Selector.Slot.Order.VERSIONS_BOOKS_LANGUAGES,
                    },
                },
            ),
            model.Add_Window(
                {
                    model_class: Browser_Model.Instance,
                    view_class: Browser_View.Instance,
                    model_data: {
                        selector_slot_order:
                            Browser_Model.Selector.Slot.Order.VERSIONS_LANGUAGES_BOOKS,
                    },
                },
            ),
        ],
    );

    new Body(
        {
            model: model,
        },
    );
}

Main();
