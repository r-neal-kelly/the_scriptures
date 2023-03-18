import * as Utils from "./utils.js"

function Resolve_Path(
    path_from_root: string,
):
    string
{
    path_from_root = path_from_root.replace(/^\//, ``);

    if (/github.io$/.test(window.location.hostname)) {
        //return `https://raw.githubusercontent.com/r-neal-kelly/the_scriptures/master/${path_from_root}`;
        return `https://raw.githubusercontent.com/r-neal-kelly/the_scriptures/master/txt/Jubilees/English/R.%20H.%20Charles/Info.json`;
    } else {
        return `/${path_from_root}`;
    }
}

type File_Name = string;

type Book_Info = {
    file_names: Array<File_Name>,
}

class Browser
{
    private element: HTMLElement | null;

    constructor(
        {
            parent_element,
        }: {
            parent_element: HTMLElement,
        },
    )
    {
        this.element = document.createElement(`div`);

        this.element.setAttribute(
            `style`,
            `
                display: grid;

                width: 100%;
                height: 100%;

                overflow-x: hidden;
                overflow-y: hidden;

                color: white;
            `,
        );

        // temp
        (async function (
            this: Browser,
        ):
            Promise<void>
        {
            this.Element().style.overflowY = `auto`;

            const info_response: Response =
                await fetch(Resolve_Path(`txt/Jubilees/English/R. H. Charles/info.json`));
            if (info_response.ok) {
                const info: Book_Info = JSON.parse(await info_response.text());
                for (const file_name of info.file_names) {
                    const file_response: Response =
                        await fetch(Resolve_Path(`txt/Jubilees/English/R. H. Charles/${file_name}`));
                    if (file_response.ok) {
                        const file_text: string = await file_response.text();
                        for (const file_line of file_text.split(/\r?\n/g)) {
                            const div: HTMLElement = document.createElement(`div`);
                            if (file_line === ``) {
                                div.textContent = `_`;
                                div.style.color = `transparent`;
                            } else {
                                div.textContent = file_line;
                            }
                            this.Element().appendChild(div);
                        }
                    }
                }
            }
        }.bind(this))();
        //

        parent_element.appendChild(this.element);
    }

    Element():
        HTMLElement
    {
        Utils.Assert(
            this.Is_Alive(),
            `Calling method on a dead instance.`,
        );
        Utils.Assert(
            this.element != null,
            `Does not have an element!`,
        );

        return this.element as HTMLElement;
    }

    Parent_Element():
        HTMLElement
    {
        Utils.Assert(
            this.Is_Alive(),
            `Calling method on a dead instance.`,
        );
        Utils.Assert(
            this.Element().parentElement != null,
            `Does not have a parent element!`,
        );

        return this.Element().parentElement as HTMLElement;
    }

    Is_Alive():
        boolean
    {
        return this.element != null;
    }

    Is_Dead():
        boolean
    {
        return !this.Is_Alive();
    }

    Kill():
        void
    {
        Utils.Assert(
            this.Is_Dead(),
            `Instance is already dead.`,
        );

        this.Parent_Element().removeChild(this.Element());

        this.element = null;
    }
}

Utils.Create_Style_Element(`
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    *:focus {
        outline: 0;
    }
    
    html, body {
        width: 100%;
        height: 100%;

        background-color: black;

        font-family: sans-serif;
    }

    span {
        display: inline-block;
    }

    .ITALIC {
        font-style: italic;
    }

    .BOLD {
        font-weight: bold;
    }

    .UNDERLINE {
        text-decoration: underline;
    }
    
    .SMALL_CAPS {
        font-variant: small-caps;
    }
`);

new Browser(
    {
        parent_element: document.body,
    },
);
