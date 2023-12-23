import * as Utils from "./utils.js";

// I think we should probably use a singleton that we can register
// content-editable divs with that will automatically set up
// all the keydown, keyup, beforeinput, and input events.
// It should be able to handle caret position and inserting
// and deleting text. I think maybe even manually, so we just
// preventDefault on the input events.

class Instance
{
    private divs: Set<HTMLDivElement>;

    constructor()
    {
        this.divs = new Set();
    }

    Has_Div(
        div: HTMLDivElement,
    ):
        boolean
    {
        return this.divs.has(div);
    }

    Add_Div(
        div: HTMLDivElement,
    ):
        void
    {
        Utils.Assert(
            !this.Has_Div(div),
            `already has div `,
        );
        Utils.Assert(
            div.getAttribute(`contentEditable`) === `true`,
            `div must have contentEditable attribute`,
        );

        div.addEventListener(`keydown`, this.On_Keydown.bind(this));
        div.addEventListener(`keyup`, this.On_Keyup.bind(this));

        this.divs.add(div);
    }

    Remove_Div(
        div: HTMLDivElement,
    ):
        void
    {
        Utils.Assert(
            this.Has_Div(div),
            `doesn't have div `,
        );

        div.removeEventListener(`keydown`, this.On_Keydown.bind(this));
        div.removeEventListener(`keyup`, this.On_Keyup.bind(this));

        this.divs.delete(div);
    }

    private On_Keydown(
        this: Instance,
        event: KeyboardEvent,
    ):
        void
    {

    }

    private On_Keyup(
        this: Instance,
        event: KeyboardEvent,
    ):
        void
    {

    }
}

let singleton: Instance | null = null;

export function Singleton():
    Instance
{
    if (singleton == null) {
        singleton = new Instance();
    }

    return singleton;
}
