import * as Utils from "./utils.js"

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

        this.element.textContent = `Browsing...`;
        (async function (
            this: Browser,
        ):
            Promise<void>
        {
            while (this.Is_Alive()) {
                const element: HTMLElement = this.Element();

                if (element.textContent === `Browsing.`) {
                    element.textContent = `Browsing..`;
                } else if (element.textContent === `Browsing..`) {
                    element.textContent = `Browsing...`;
                } else if (element.textContent === `Browsing...`) {
                    element.textContent = `Browsing.`;
                } else {
                    Utils.Assert(false);
                }

                await Utils.Wait_Milliseconds(300);
            }
        }.bind(this))();

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
