import { Integer } from "../types.js";
import { Count } from "../types.js";
import { Index } from "../types.js";
import { Name } from "../types.js";

import * as Utils from "../utils.js";

import * as Language from "../model/language.js";

import { Key } from "./key.js";
import * as Reserved_Keys from "./reserved_keys.js";
import * as Held_Keys from "./held_keys.js";
import * as Layout from "./layout.js";
import * as Hook from "./hook.js";

const NONE_KEY: Key = Key.DIGIT_0;
const HEBREW_KEY: Key = Key.DIGIT_9;
const GREEK_KEY: Key = Key.DIGIT_8;
const LATIN_KEY: Key = Key.DIGIT_7;
const ARAMAIC_KEY: Key = Key.DIGIT_6;
const GEEZ_KEY: Key = Key.DIGIT_5;
const ARABIC_KEY: Key = Key.DIGIT_4;

export class Instance
{
    private layouts: { [language_name: Name]: Array<Layout.Instance> };
    private selected_subsets: { [language_name: Name]: Index };
    private default_layout: Layout.Instance | null;
    private current_layout: Layout.Instance | null;
    private divs_to_hooks: Map<HTMLDivElement, Hook.Instance>;
    private held_keys: Held_Keys.Instance;
    private message_div: HTMLDivElement;
    private message_reference_count: Count;

    constructor(
        {
            layouts,
            default_layout_language_name,
            default_layout_subset_name,
        }: {
            layouts: Array<Layout.Instance>,
            default_layout_language_name: Language.Name | null,
            default_layout_subset_name: Name | null,
        },
    )
    {
        this.layouts = Object.create(null);
        this.selected_subsets = Object.create(null);

        for (const layout of layouts) {
            const language_name: Language.Name =
                layout.Language_Name();

            if (this.layouts[language_name] == null) {
                this.layouts[language_name] = [];
            }

            Utils.Assert(
                this.Maybe_Index_Of_Layout(
                    language_name,
                    layout.Subset_Name(),
                ) == null,
                `cannot have layouts with duplicate names`,
            );

            this.layouts[language_name].push(layout);
        }

        for (const language_name of Object.keys(this.layouts)) {
            this.layouts[language_name].sort(
                function (
                    a: Layout.Instance,
                    b: Layout.Instance,
                ):
                    Integer
                {
                    if (a.Is_Language_Default()) {
                        return -1;
                    } else if (b.Is_Language_Default()) {
                        return 1;
                    } else {
                        const a_subset_name: Name | null = a.Subset_Name();
                        const b_subset_name: Name | null = b.Subset_Name();

                        if (a_subset_name == null) {
                            return -1;
                        } else if (b_subset_name == null) {
                            return 1;
                        } else {
                            if (a_subset_name < b_subset_name) {
                                return -1;
                            } else if (a_subset_name > b_subset_name) {
                                return 1;
                            } else {
                                return 0;
                            }
                        }
                    }
                },
            );
            this.selected_subsets[language_name] = 0;
        }

        if (default_layout_language_name != null) {
            this.default_layout = this.Layout(
                default_layout_language_name,
                default_layout_subset_name,
            );
            this.current_layout = this.default_layout;
        } else {
            this.default_layout = null;
            this.current_layout = null;
        }

        this.divs_to_hooks = new Map();
        this.held_keys = new Held_Keys.Instance();

        this.message_div = document.createElement(`div`);
        this.message_div.style.position = `fixed`;
        this.message_div.style.left = `0`;
        this.message_div.style.top = `0`;
        this.message_div.style.zIndex = `100000`;
        this.message_div.style.padding = `3px`;
        this.message_div.style.backgroundColor = `black`;
        this.message_div.style.color = `white`;
        this.message_div.style.borderStyle = `solid`;
        this.message_div.style.borderWidth = `1px`;
        this.message_div.style.borderColor = `white`;

        this.message_reference_count = 0;
    }

    private Maybe_Index_Of_Layout(
        language_name: Language.Name,
        subset_name: Name | null,
    ):
        Index | null
    {
        if (this.layouts[language_name] != null) {
            let index: Index | null = null;

            for (let idx = 0, end = this.layouts[language_name].length; idx < end; idx += 1) {
                const layout: Layout.Instance = this.layouts[language_name][idx];
                if (layout.Subset_Name() === subset_name) {
                    index = idx;
                    break;
                }
            }

            return index;
        } else {
            return null;
        }
    }

    Has_Layout(
        language_name: Language.Name,
        subset_name: Name | null,
    ):
        boolean
    {
        const maybe_index: Index | null =
            this.Maybe_Index_Of_Layout(language_name, subset_name);

        return maybe_index != null;
    }

    Layout(
        language_name: Language.Name,
        subset_name: Name | null,
    ):
        Layout.Instance
    {
        const maybe_index: Index | null =
            this.Maybe_Index_Of_Layout(language_name, subset_name);

        Utils.Assert(
            maybe_index != null,
            `does not have layout:\n` +
            `language_name: ${language_name}\n` +
            `subset_name: ${subset_name}`,
        );

        return this.layouts[language_name][maybe_index as Index];
    }

    Has_Default_Layout():
        boolean
    {
        return this.default_layout != null;
    }

    Default_Layout():
        Layout.Instance
    {
        Utils.Assert(
            this.Has_Default_Layout(),
            `does not have a default_layout`,
        );

        return this.default_layout as Layout.Instance;
    }

    Has_Current_Layout():
        boolean
    {
        return this.current_layout != null;
    }

    Current_Layout():
        Layout.Instance
    {
        Utils.Assert(
            this.Has_Current_Layout(),
            `does not have a current_layout`,
        );

        return this.current_layout as Layout.Instance;
    }

    private Set_Current_Layout(
        language_name: Language.Name | null,
        subset_name: Name | null,
    ):
        void
    {
        if (language_name != null) {
            this.current_layout = this.Layout(
                language_name as Language.Name,
                subset_name,
            );
        } else {
            this.current_layout = null;
        }

        for (const hook of this.divs_to_hooks.values()) {
            hook.On_Change_Global_Layout(
                this.current_layout,
            );
        }
    }

    Current_Language_Name():
        Language.Name
    {
        if (this.Has_Current_Layout()) {
            return this.Current_Layout().Language_Name();
        } else {
            return Language.Name.ENGLISH;
        }
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

        hook.On_Change_Global_Layout(
            this.current_layout,
        );
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

    private Div_From_Event(
        event: Event,
    ):
        HTMLDivElement
    {
        let element: HTMLElement | null =
            event.target as HTMLElement | null;

        while (element != null) {
            if (this.Has_Div(element as HTMLDivElement)) {
                return element as HTMLDivElement;
            } else {
                element = element.parentElement;
            }
        }

        Utils.Assert(
            false,
            `unknown target element`,
        );

        return event.target as HTMLDivElement;
    }

    private async On_Keydown(
        this: Instance,
        event: KeyboardEvent,
    ):
        Promise<void>
    {
        if (!event.repeat) {
            const key: Key = event.code as Key;
            if (
                !Reserved_Keys.Has(key) ||
                key === Reserved_Keys.META_KEY
            ) {
                this.held_keys.Add(event.code as Key);
            }
        }

        if (!event.defaultPrevented) {
            if (this.held_keys.Has(Reserved_Keys.META_KEY)) {
                await this.On_Meta_Keydown(event);
            } else {
                await this.On_Layout_Keydown(event);
            }
        }
    }

    private async On_Keyup(
        this: Instance,
        event: KeyboardEvent,
    ):
        Promise<void>
    {
        if (!event.defaultPrevented) {
            if (this.held_keys.Has(Reserved_Keys.META_KEY)) {
                await this.On_Meta_Keyup(event);
            } else {
                await this.On_Layout_Keyup(event);
            }
        }

        this.held_keys.Remove(event.code as Key);
    }

    private async Before_Input(
        this: Instance,
        event: InputEvent,
    ):
        Promise<void>
    {
        if (!event.defaultPrevented) {
            const div: HTMLDivElement =
                this.Div_From_Event(event);
            const hook: Hook.Instance =
                this.divs_to_hooks.get(div) as Hook.Instance;
            Utils.Assert(
                hook != null,
                `hook should not be null`,
            );

            if (event.inputType === `insertText`) {
                event.preventDefault();

                await this.Send_Insert_To_Selection(
                    div,
                    hook,
                    event.data || ``,
                );
            } else if (event.inputType === `insertFromPaste`) {
                event.preventDefault();

                await this.Send_Paste_To_Selection(
                    div,
                    hook,
                    event.data || event.dataTransfer?.getData(`text/plain`) || ``,
                );
            } else if (event.inputType === `deleteContentBackward`) {
                event.preventDefault();

                await this.Send_Delete(
                    div,
                    hook,
                    event.getTargetRanges()[0],
                );
            }
        }
    }

    private async Send_Insert_To_Selection(
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
                data: data.replace(/ /g, ` `),
                range: range,
            },
        );
        await hook.After_Insert_Or_Paste_Or_Delete();
    }

    private async Send_Paste_To_Selection(
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

        await hook.On_Paste(
            {
                data: data.replace(/ /g, ` `),
                range: range,
            },
        );
        await hook.After_Insert_Or_Paste_Or_Delete();
    }

    private async Send_Delete(
        div: HTMLDivElement,
        hook: Hook.Instance,
        static_range: StaticRange,
    ):
        Promise<void>
    {
        const range: Range = document.createRange();

        range.setStart(static_range.startContainer, static_range.startOffset);
        range.setEnd(static_range.endContainer, static_range.endOffset);

        await hook.On_Delete(
            {
                range: range,
            },
        );
        await hook.After_Insert_Or_Paste_Or_Delete();
    }

    private async Send_Message(
        message: string,
    ):
        Promise<void>
    {
        this.message_div.textContent = message;
        document.body.style.position = `relative`;

        if (this.message_reference_count < 1) {
            document.body.appendChild(this.message_div);
        }

        this.message_reference_count += 1;
        await Utils.Wait_Seconds(2);
        this.message_reference_count -= 1;

        if (this.message_reference_count < 1) {
            document.body.removeChild(this.message_div);
        }
    }

    private async On_Meta_Keydown(
        event: KeyboardEvent,
    ):
        Promise<void>
    {
        event.preventDefault();

        if (!event.repeat) {
            if (this.held_keys.Is([Reserved_Keys.META_KEY, NONE_KEY])) {
                this.Set_Current_Layout(null, null);
                this.Send_Message(`Global Layout: None`);
            } else {
                let language_name: Language.Name | null;
                if (this.held_keys.Is([Reserved_Keys.META_KEY, HEBREW_KEY])) {
                    language_name = Language.Name.HEBREW;
                } else if (this.held_keys.Is([Reserved_Keys.META_KEY, GREEK_KEY])) {
                    language_name = Language.Name.GREEK;
                } else if (this.held_keys.Is([Reserved_Keys.META_KEY, LATIN_KEY])) {
                    language_name = Language.Name.LATIN;
                } else if (this.held_keys.Is([Reserved_Keys.META_KEY, ARAMAIC_KEY])) {
                    language_name = Language.Name.ARAMAIC;
                } else if (this.held_keys.Is([Reserved_Keys.META_KEY, GEEZ_KEY])) {
                    language_name = Language.Name.GEEZ;
                } else if (this.held_keys.Is([Reserved_Keys.META_KEY, ARABIC_KEY])) {
                    language_name = Language.Name.ARABIC;
                } else {
                    language_name = null;
                }

                if (
                    language_name != null &&
                    this.layouts[language_name] != null
                ) {
                    let selected_subset: Index = this.selected_subsets[language_name];
                    if (
                        this.message_reference_count > 0 &&
                        this.Has_Current_Layout() &&
                        this.Current_Layout().Language_Name() === language_name
                    ) {
                        selected_subset += 1;
                        if (selected_subset >= this.layouts[language_name].length) {
                            selected_subset = 0;
                        }
                        this.selected_subsets[language_name] = selected_subset;
                    }

                    this.Set_Current_Layout(
                        language_name,
                        this.layouts[language_name][selected_subset].Subset_Name(),
                    );

                    this.Send_Message(
                        `Global Layout: ${this.Current_Layout().Full_Name()}`,
                    );
                }
            }
        }
    }

    private async On_Meta_Keyup(
        event: KeyboardEvent,
    ):
        Promise<void>
    {
        event.preventDefault();
    }

    private async On_Layout_Keydown(
        event: KeyboardEvent,
    ):
        Promise<void>
    {
        const div: HTMLDivElement =
            this.Div_From_Event(event);
        const hook: Hook.Instance =
            this.divs_to_hooks.get(div) as Hook.Instance;
        Utils.Assert(
            hook != null,
            `hook should not be null`,
        );

        await hook.On_Key_Down(event);

        if (
            !event.ctrlKey &&
            !event.altKey &&
            this.Has_Current_Layout()
        ) {
            if (!event.repeat) {
                let held_keys: Held_Keys.Instance = this.held_keys;
                while (held_keys.Count() > 0) {
                    const maybe_space: Layout.Space.Instance | boolean =
                        this.Current_Layout().Maybe_Space(
                            held_keys,
                            event.shiftKey,
                            event.getModifierState(Key.CAPS_LOCK),
                        );

                    if (maybe_space instanceof Layout.Space.Instance) {
                        event.preventDefault();
                        this.held_keys.Clear();
                        return;
                    } else if (maybe_space as boolean) {
                        event.preventDefault();
                        return;
                    } else {
                        held_keys = held_keys.Slice(1);
                    }
                }
            }

            let held_keys: Held_Keys.Instance = this.held_keys;
            while (held_keys.Count() > 0) {
                const maybe_output: string | boolean =
                    this.Current_Layout().Maybe_Output(
                        held_keys,
                        event.shiftKey,
                        event.getModifierState(Key.CAPS_LOCK),
                    );

                if (Utils.Is.String(maybe_output)) {
                    event.preventDefault();
                    await this.Send_Insert_To_Selection(div, hook, maybe_output as string);
                    return;
                } else if (maybe_output as boolean) {
                    event.preventDefault();
                    return;
                } else {
                    held_keys = held_keys.Slice(1);
                }
            }
        }
    }

    private async On_Layout_Keyup(
        event: KeyboardEvent,
    ):
        Promise<void>
    {
        const div: HTMLDivElement =
            this.Div_From_Event(event);
        const hook: Hook.Instance =
            this.divs_to_hooks.get(div) as Hook.Instance;
        Utils.Assert(
            hook != null,
            `hook should not be null`,
        );

        await hook.On_Key_Up(event);
    }
}

let singleton: Instance | null = null;

export function Singleton():
    Instance
{
    if (singleton == null) {
        singleton = new Instance(
            {
                layouts: [
                    new Layout.Hebrew.Phonetic.Instance(),
                    new Layout.Hebrew.International.Instance(),
                    new Layout.Greek.Combining_Polytonic.Instance(),
                    new Layout.Greek.Combining_Monotonic.Instance(),
                    new Layout.Greek.Polytonic.Instance(),
                    new Layout.Greek.Monotonic.Instance(),
                    new Layout.Latin.Instance(),
                    new Layout.Aramaic.Abjad.Instance(),
                    new Layout.Geez.Abugida.Instance(),
                    new Layout.Geez.Abjad.Instance(),
                    new Layout.Arabic.Abjad.Instance(),
                ],
                default_layout_language_name: Language.Name.LATIN,
                default_layout_subset_name: null,
            },
        );
    }

    return singleton;
}
