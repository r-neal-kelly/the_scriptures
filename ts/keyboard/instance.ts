import * as Utils from "../utils.js";

import * as Hook from "./hook.js";

export class Instance
{
    private divs_to_hooks: Map<HTMLDivElement, Hook.Instance>;

    constructor()
    {
        this.divs_to_hooks = new Map();
    }

    Has_Div(
        div: HTMLDivElement,
    ):
        boolean
    {
        return this.divs_to_hooks.has(div);
    }

    Add_Div(
        div: HTMLDivElement,
        hook: Hook.Instance,
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
        div.addEventListener(`beforeinput`, this.Before_Input.bind(this));

        this.divs_to_hooks.set(div, hook);
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
        div.removeEventListener(`beforeinput`, this.Before_Input.bind(this));

        this.divs_to_hooks.delete(div);
    }

    private async On_Keydown(
        this: Instance,
        event: KeyboardEvent,
    ):
        Promise<void>
    {

    }

    private async On_Keyup(
        this: Instance,
        event: KeyboardEvent,
    ):
        Promise<void>
    {

    }

    private async Before_Input(
        this: Instance,
        event: InputEvent,
    ):
        Promise<void>
    {
        const div: HTMLDivElement =
            event.target as HTMLDivElement;
        const hook: Hook.Instance =
            this.divs_to_hooks.get(div) as Hook.Instance;

        Utils.Assert(
            div != null,
            `div should not be null`,
        );
        Utils.Assert(
            this.Has_Div(div),
            `unknown div`,
        );
        Utils.Assert(
            hook != null,
            `hook should not be null`,
        );

        if (event.inputType === `insertText`) {
            const data: string =
                event.data || ``;
            const target_ranges: Array<StaticRange> =
                event.getTargetRanges();

            Utils.Assert(
                target_ranges.length === 1,
                `don't know why target_ranges has 0 or more than 1 range in it`,
            );

            event.preventDefault();

            await hook.On_Insert(
                {
                    div: div,
                    data: event.data || ``,
                    target_range: target_ranges[0],
                },
            );
            await hook.After_Insert_Or_Paste_Or_Delete(
                event,
            );
        } else if (event.inputType === `insertFromPaste`) {
            await hook.On_Paste(
                event,
            );
            await hook.After_Insert_Or_Paste_Or_Delete(
                event,
            );
        } else if (event.inputType === `deleteContentBackward`) {
            await hook.On_Delete(
                event,
            );
            await hook.After_Insert_Or_Paste_Or_Delete(
                event,
            );
        }
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
