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
    const view = new Body(
        {
            model: model,
        },
    );

    // Once we set up our save file structure, or at least prototype it,
    // we'll pull each window's model's data from there and pass it along.
    const data: Array<[Browser_Model.Body.Selector.Slot.Order, string]> = [
        //[Browser_Model.Body.Selector.Slot.Order.BOOKS_LANGUAGES_VERSIONS, `Chapter 01.txt`],
        //[Browser_Model.Body.Selector.Slot.Order.BOOKS_VERSIONS_LANGUAGES, `Chapter 02.txt`],
        //[Browser_Model.Body.Selector.Slot.Order.LANGUAGES_BOOKS_VERSIONS, `Chapter 03.txt`],
        //[Browser_Model.Body.Selector.Slot.Order.LANGUAGES_VERSIONS_BOOKS, `Chapter 04.txt`],
        //[Browser_Model.Body.Selector.Slot.Order.VERSIONS_BOOKS_LANGUAGES, `Chapter 05.txt`],
        //[Browser_Model.Body.Selector.Slot.Order.VERSIONS_LANGUAGES_BOOKS, `Chapter 06.txt`],

        [Browser_Model.Body.Selector.Slot.Order.BOOKS_LANGUAGES_VERSIONS, `Chapter 01.txt`],
        [Browser_Model.Body.Selector.Slot.Order.VERSIONS_LANGUAGES_BOOKS, `Chapter 02.txt`],
    ];
    for (const [order, file_name] of data) {
        model.Add_Program(
            new Model.Window.Program.Instance(
                {
                    model_class: Browser_Model.Instance,
                    model_data: {
                        selection: new Browser_Model.Selection.Name(
                            {
                                book: `Jubilees`,
                                language: `English`,
                                version: `R. H. Charles`,
                                file: file_name,
                            },
                        ),
                        selector_slot_order: order,
                        is_selector_open: false,
                    },
                    view_class: Browser_View.Instance,
                },
            ),
        );
    }
}

Main();
