import * as Utils from "../utils.js";
import * as Event from "../event.js";

import * as Entity from "./entity.js";

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
    type Data = Array<
        [
            Browser_Model.Body.Selector.Slot.Order,
            string,
            string,
            string,
            string,
        ]
    >;
    const data: Data = [
        [
            Browser_Model.Body.Selector.Slot.Order.BOOKS_LANGUAGES_VERSIONS,
            `Genesis`,
            `English`,
            `KJV 1872-1888+`,
            `Chapter 01.txt`,
        ],
        [
            Browser_Model.Body.Selector.Slot.Order.VERSIONS_LANGUAGES_BOOKS,
            `Jubilees`,
            `English`,
            `R. H. Charles 1913`,
            `Chapter 01.txt`,
        ],
    ];
    for (const [order, book_name, language_name, version_name, file_name] of data) {
        model.Add_Program(
            new Model.Window.Program.Instance(
                {
                    model_class: Browser_Model.Instance,
                    model_data: {
                        selection: new Browser_Model.Selection.Name(
                            {
                                book: book_name,
                                language: language_name,
                                version: version_name,
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

// temp
import * as Search from "../model/search.js"
(
    async function ()
    {
        const search: Search.Instance = new Search.Instance(
            {
                ignore_markup: true,
                respect_case: false,
                align_on_word: false,
            },
        );

        await search.Ready();

        (window as any).Test = search;
    }
)();
//
