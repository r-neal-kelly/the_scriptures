import { Name } from "../types.js";

import * as Utils from "../utils.js";

import { Key } from "./key.js";
import * as Held_Keys from "./held_keys.js";
import * as Layout from "./layout.js";
import * as Hook from "./hook.js";

export class Instance
{
    private divs_to_hooks: Map<HTMLDivElement, Hook.Instance>;
    private held_keys: Held_Keys.Instance;
    private layouts: { [layout_name: Name]: Layout.Instance };
    private current_layout: Layout.Instance;

    constructor()
    {
        const latin_layout: Layout.Latin.Instance = new Layout.Latin.Instance();

        this.divs_to_hooks = new Map();
        this.held_keys = new Held_Keys.Instance();
        this.layouts = Object.create(null);
        this.current_layout = latin_layout;

        this.layouts[latin_layout.Name()] = latin_layout;
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

    Held_Keys():
        Held_Keys.Instance
    {
        return this.held_keys;
    }

    Layout(
        name: Name,
    ):
        Layout.Instance
    {
        Utils.Assert(
            this.layouts[name] != null,
            `does not have layout with name ${name}`,
        );

        return this.layouts[name] as Layout.Instance;
    }

    Current_Layout():
        Layout.Instance
    {
        return this.current_layout;
    }

    private async Send_Input_To_Selection(
        div: HTMLDivElement,
        hook: Hook.Instance,
        data: string,
    ):
        Promise<void>
    {
        const selection: Selection = document.getSelection() as Selection;

        Utils.Assert(
            selection != null,
            `how in the world is there not a selection here?`,
        );
        Utils.Assert(
            selection.rangeCount > 0,
            `how in the world is there not a range here?`,
        );

        const range: Range = selection.getRangeAt(0);

        await hook.On_Insert(
            {
                div: div,
                data: data.replace(/ /g, ` `),
                range: range,
            },
        );
        await hook.After_Insert_Or_Paste_Or_Delete();
    }

    private async On_Keydown(
        this: Instance,
        event: KeyboardEvent,
    ):
        Promise<void>
    {
        event.stopPropagation();

        const div: HTMLDivElement =
            event.target as HTMLDivElement;
        const hook: Hook.Instance =
            this.divs_to_hooks.get(div) as Hook.Instance;

        if (!event.repeat) {
            const key: Key = event.code as Key;
            if (
                key != Key.SHIFT_LEFT &&
                key != Key.SHIFT_RIGHT &&
                key != Key.CONTROL_LEFT &&
                key != Key.CONTROL_RIGHT &&
                key != Key.ALT_LEFT &&
                key != Key.ALT_RIGHT
            ) {
                this.held_keys.Add(event.code as Key);
            }
        }

        await hook.On_Key_Down(event);

        if (!event.repeat) {
            const maybe_space: Layout.Space.Instance | boolean =
                this.Current_Layout().Maybe_Space(this.held_keys);

            if (maybe_space instanceof Layout.Space.Instance) {
                event.preventDefault();
                this.held_keys.Clear();
            } else if (maybe_space as boolean) {
                event.preventDefault();
            } else {
                const maybe_output: string | boolean =
                    this.Current_Layout().Maybe_Output(
                        this.held_keys,
                        event.shiftKey,
                        event.getModifierState(Key.CAPS_LOCK),
                    );

                if (Utils.Is.String(maybe_output)) {
                    event.preventDefault();
                    await this.Send_Input_To_Selection(div, hook, maybe_output as string);
                } else {
                    if (maybe_output as boolean) {
                        event.preventDefault();
                    }
                }
            }
        } else {
            const maybe_output: string | boolean =
                this.Current_Layout().Maybe_Output(
                    this.held_keys,
                    event.shiftKey,
                    event.getModifierState(Key.CAPS_LOCK),
                );

            if (Utils.Is.String(maybe_output)) {
                event.preventDefault();
                await this.Send_Input_To_Selection(div, hook, maybe_output as string);
            } else {
                if (maybe_output as boolean) {
                    event.preventDefault();
                }
            }
        }
    }

    private async On_Keyup(
        this: Instance,
        event: KeyboardEvent,
    ):
        Promise<void>
    {
        event.stopPropagation();

        const div: HTMLDivElement =
            event.target as HTMLDivElement;
        const hook: Hook.Instance =
            this.divs_to_hooks.get(div) as Hook.Instance;

        await hook.On_Key_Up(event);

        this.held_keys.Remove(event.code as Key);
    }

    private async Before_Input(
        this: Instance,
        event: InputEvent,
    ):
        Promise<void>
    {
        event.stopPropagation();

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
            event.preventDefault();

            // We replace spaces with the non-breaking space
            // to ensure that they are all rendered properly.
            const data: string =
                (event.data || ``).replace(/ /g, ` `);
            const target_ranges: Array<StaticRange> =
                event.getTargetRanges();

            Utils.Assert(
                target_ranges.length === 1,
                `don't know why target_ranges has 0 or more than 1 range in it`,
            );

            const range: Range = document.createRange();

            range.setStart(target_ranges[0].startContainer, target_ranges[0].startOffset);
            range.setEnd(target_ranges[0].endContainer, target_ranges[0].endOffset);

            await hook.On_Insert(
                {
                    div: div,
                    data: data,
                    range: range,
                },
            );
            await hook.After_Insert_Or_Paste_Or_Delete();
        } else if (event.inputType === `insertFromPaste`) {
            await hook.On_Paste(
                event,
            );
            await hook.After_Insert_Or_Paste_Or_Delete();
        } else if (event.inputType === `deleteContentBackward`) {
            await hook.On_Delete(
                event,
            );
            await hook.After_Insert_Or_Paste_Or_Delete();
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
