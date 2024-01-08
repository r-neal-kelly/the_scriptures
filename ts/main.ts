import * as Model from "./model.js";
import * as View from "./view.js";

async function Main():
    Promise<void>
{
    const model: Model.Main.Instance = new Model.Main.Instance();

    await model.Ready();

    // Once we set up our save file structure, or at least prototype it,
    // we'll pull each window's model's data from there and pass it along.
    type Data = Array<
        [
            Model.Selector.Slot.Order,
            string,
            string,
            string,
            string,
        ]
    >;
    const data: Data = [
        [
            Model.Selector.Slot.Order.LANGUAGES_VERSIONS_BOOKS,
            `Genesis`,
            `English`,
            `KJV 1872-1888`,
            `Chapter 01`,
        ],
        [
            Model.Selector.Slot.Order.VERSIONS_BOOKS_LANGUAGES,
            `Genesis`,
            `Hebrew`,
            `Hexaglot 1857-1906`,
            `Chapter 01`,
        ],
        [
            Model.Selector.Slot.Order.VERSIONS_BOOKS_LANGUAGES,
            `Genesis`,
            `Greek`,
            `Hexaglot 1857-1906`,
            `Chapter 01`,
        ],
        [
            Model.Selector.Slot.Order.VERSIONS_BOOKS_LANGUAGES,
            `Genesis`,
            `Latin`,
            `Hexaglot 1857-1906`,
            `Chapter 01`,
        ],
        [
            Model.Selector.Slot.Order.BOOKS_LANGUAGES_VERSIONS,
            `Jubilees`,
            `English`,
            `R. H. Charles 1913`,
            `Chapter 02`,
        ],
    ];

    let is_window_active: boolean = true;
    for (const [order, book_name, language_name, version_name, file_name] of data) {
        model.Layout().Add_Program(
            new Model.Layout.Window.Program.Instance(
                {
                    model_class: Model.Browser.Instance,
                    model_data: {
                        selection: new Model.Data.Selection.Name(
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
                    view_class: View.Browser.Instance,
                    is_window_active: is_window_active,
                },
            ),
        );
        is_window_active = false;
    }

    model.Layout().Add_Program(
        new Model.Layout.Window.Program.Instance(
            {
                model_class: Model.Finder.Instance,
                model_data: undefined,
                view_class: View.Finder.Instance,
                is_window_active: false,
            },
        ),
    );

    new View.Main.Instance(
        {
            model: model,
        },
    );
}

Main();
