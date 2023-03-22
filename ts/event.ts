import * as Utils from "./utils.js";
import * as Execution from "./execution.js";
import * as Messenger from "./messenger.js";

export class Grid
{
    private messenger: Messenger.Instance;
    private objects: Map<Object, Listeners>; // why are we using a map again?
    private execution_frames: { [index: Affix]: Execution.Frame };

    constructor()
    {
        this.messenger = new Messenger.Instance();
        this.objects = new Map();
        this.execution_frames = {};
    }

    Has(
        object: Object,
    ):
        boolean
    {
        return this.objects.has(object);
    }

    Add(
        object: Object,
    ):
        void
    {
        Utils.Assert(
            !this.Has(object),
            `This object is already in the grid.`,
        );

        this.objects.set(object, new Listeners());
    }

    Add_Many(
        objects: Array<Object>,
    ):
        void
    {
        for (const object of objects) {
            this.Add(object);
        }
    }

    Remove(
        object: Object,
    ):
        void
    {
        Utils.Assert(
            this.Has(object),
            `This object is not in the grid.`,
        );

        this.Remove_All_Listeners(object);
        this.objects.delete(object);
    }

    Remove_Many(
        objects: Array<Object>,
    ):
        void
    {
        for (const object of objects) {
            this.Remove(object);
        }
    }

    Remove_All():
        void
    {
        for (const object of this.objects.keys()) {
            this.Remove(object);
        }
    }

    private Some_Listeners(
        object: Object,
    ):
        Listeners
    {
        if (!this.Has(object)) {
            this.Add(object);
        }

        return this.objects.get(object) as Listeners;
    }

    Has_Listener(
        object: Object,
        listener_handle: Listener_Handle,
    ):
        boolean
    {
        return this.Some_Listeners(object).Has(listener_handle);
    }

    Add_Listener(
        object: Object,
        listener_info: Listener_Info,
    ):
        Listener_Handle
    {
        return this.Some_Listeners(object).Add(
            {
                messenger: this.messenger,
                object: object,
                listener_info: listener_info,
            },
        );
    }

    Add_Many_Listeners(
        object: Object,
        listener_infos: Array<Listener_Info>,
    ):
        Array<Listener_Handle>
    {
        return this.Some_Listeners(object).Add_Many(
            {
                messenger: this.messenger,
                object: object,
                listener_infos: listener_infos,
            },
        );
    }

    Remove_Listener(
        object: Object,
        listener_handle: Listener_Handle,
    ):
        void
    {
        this.Some_Listeners(object).Remove(
            {
                messenger: this.messenger,
                listener_handle: listener_handle,
            },
        );
    }

    Remove_Many_Listeners(
        object: Object,
        listener_handles: Array<Listener_Handle>,
    ):
        void
    {
        this.Some_Listeners(object).Remove_Many(
            {
                messenger: this.messenger,
                listener_handles: listener_handles,
            },
        );
    }

    Remove_All_Listeners(
        object: Object,
    ):
        void
    {
        this.Some_Listeners(object).Remove_All(
            {
                messenger: this.messenger,
            },
        );
    }

    private Some_Execution_Frame(
        affix: Affix,
    ):
        Execution.Frame
    {
        if (this.execution_frames[affix] == null) {
            this.execution_frames[affix] = new Execution.Frame();
        }

        return this.execution_frames[affix];
    }

    async Send(
        event_info: Info,
    ):
        Promise<void>
    {
        await new Instance(
            this.messenger,
            this.Some_Execution_Frame(event_info.Affix()),
            event_info,
        ).Execute();
    }
};

export type Handler = Messenger.Subscriber_Handler;

export type Priority = Messenger.Subscriber_Priority;

export class Listener_Info
{
    private event_name: Name;
    private event_handler: Handler;
    private event_priority: Priority;

    constructor(
        {
            event_name,
            event_handler,
            event_priority,
        }: {
            event_name: Name,
            event_handler: Handler,
            event_priority: Priority,
        },
    )
    {
        this.event_name = event_name;
        this.event_handler = event_handler;
        this.event_priority = event_priority;

        Object.freeze(this);
    }

    Event_Name():
        Name
    {
        return this.event_name;
    }

    Event_Handler():
        Handler
    {
        return this.event_handler;
    }

    Event_Priority():
        Priority
    {
        return this.event_priority;
    }
};

export type Listener_Handle = Messenger.Subscription;

class Listeners
{
    private listener_handles: Set<Listener_Handle>;

    constructor()
    {
        this.listener_handles = new Set();
    }

    Has(
        listener_handle: Listener_Handle,
    ):
        boolean
    {
        return this.listener_handles.has(listener_handle);
    }

    Add(
        {
            messenger,
            object,
            listener_info,
        }: {
            messenger: Messenger.Instance,
            object: Object,
            listener_info: Listener_Info,
        },
    ):
        Listener_Handle
    {
        const listener_handle: Listener_Handle = messenger.Subscribe(
            listener_info.Event_Name().String(),
            new Messenger.Subscriber_Info(
                {
                    handler: listener_info.Event_Handler().bind(object),
                    priority: listener_info.Event_Priority(),
                },
            ),
        );
        this.listener_handles.add(listener_handle);

        return listener_handle;
    }

    Add_Many(
        {
            messenger,
            object,
            listener_infos,
        }: {
            messenger: Messenger.Instance,
            object: Object,
            listener_infos: Array<Listener_Info>,
        },
    ):
        Array<Listener_Handle>
    {
        const listener_handles: Array<Listener_Handle> = [];
        for (const listener_info of listener_infos) {
            listener_handles.push(
                this.Add(
                    {
                        object,
                        listener_info,
                        messenger,
                    },
                ),
            );
        }

        return listener_handles;
    }

    Remove(
        {
            messenger,
            listener_handle,
        }: {
            messenger: Messenger.Instance,
            listener_handle: Listener_Handle,
        },
    ):
        void
    {
        messenger.Unsubscribe(listener_handle);
        this.listener_handles.delete(listener_handle);
    }

    Remove_Many(
        {
            messenger,
            listener_handles,
        }: {
            messenger: Messenger.Instance,
            listener_handles: Array<Listener_Handle>,
        },
    ):
        void
    {
        for (const listener_handle of listener_handles) {
            this.Remove(
                {
                    listener_handle,
                    messenger,
                },
            );
        }
    }

    Remove_All(
        {
            messenger,
        }: {
            messenger: Messenger.Instance,
        },
    ):
        void
    {
        for (const listener_handle of this.listener_handles.values()) {
            this.Remove(
                {
                    listener_handle,
                    messenger,
                },
            );
        }
    }
};

export enum Prefix
{
    BEFORE = `Before`,
    ON = `On`,
    AFTER = `After`,
}

export type Affix = string;

export type Suffix = string;

export class Name
{
    private text: string;

    private static Has_Dangling_Underscore(
        text: string,
    ):
        boolean
    {
        return (
            text.length > 0 &&
            (
                text[0] === `_` ||
                text[text.length - 1] === `_`
            )
        );
    }

    constructor(
        prefix: Prefix,
        affix: Affix,
        suffix?: Suffix | null,
    )
    {
        Utils.Assert(
            affix.length > 0,
            `The affix must have at least one character.`,
        );
        Utils.Assert(
            !Name.Has_Dangling_Underscore(affix),
            `The affix cannot have a dangling '_' on the beginning or end of the string.`,
        );
        Utils.Assert(
            suffix == null || suffix.length > 0,
            `The suffix must either be null or a string with at least one character.`,
        );
        Utils.Assert(
            suffix == null || !Name.Has_Dangling_Underscore(suffix),
            `The suffix cannot have a dangling '_' on the beginning or end of the string.`,
        );

        if (suffix != null) {
            this.text = `${prefix}_${affix}_${suffix}`;
        } else {
            this.text = `${prefix}_${affix}`;
        }

        Object.freeze(this);
    }

    String():
        string
    {
        return this.text;
    }
};

import { Publication_Type as Type } from "./messenger.js";
export { Publication_Type as Type } from "./messenger.js";

export type Data = Object;

export class Info
{
    private affix: Affix;
    private suffixes: Array<Suffix>;
    private type: Type;
    private data: Data;

    constructor(
        {
            affix,
            suffixes,
            type,
            data,
        }: {
            affix: Affix,
            suffixes: Array<Suffix>,
            type: Type,
            data: Data,
        },
    )
    {
        this.affix = affix;
        this.suffixes = Array.from(suffixes);
        this.type = type;
        this.data = data;

        Object.freeze(this.suffixes);
        Object.freeze(this);
    }

    Affix():
        Affix
    {
        return this.affix;
    }

    Suffixes():
        Array<Suffix>
    {
        return this.suffixes;
    }

    Type():
        Type
    {
        return this.type;
    }

    Data():
        Data
    {
        return this.data;
    }
};

export class Instance
{
    static KEY: symbol = Symbol(`Used to get Event.Instance from Event.Data`);

    static From(
        data: Data,
    ):
        Instance | null
    {
        return (data as { [index: symbol]: Instance })[Instance.KEY];
    }

    private messenger: Messenger.Instance;
    private execution_frame: Execution.Frame;
    private info: Info;

    private has_executed: boolean;

    constructor(
        messenger: Messenger.Instance,
        execution_frame: Execution.Frame,
        info: Info,
    )
    {
        Utils.Assert(
            !Object.isFrozen(info.Data()),
            `The data object cannot be frozen.`,
        );

        this.messenger = messenger;
        this.execution_frame = execution_frame;
        this.info = info;

        this.has_executed = false;

        (this.info.Data() as { [index: symbol]: Instance })[Instance.KEY] = this;
    }

    Has_Executed():
        boolean
    {
        return this.has_executed;
    }

    async Execute():
        Promise<void>
    {
        Utils.Assert(
            this.has_executed === false,
            `This event instance has already been executed.`,
        );

        this.has_executed = true;

        await this.execution_frame.Execute(
            this.info.Type(),
            async function (
                this: Instance,
            ):
                Promise<void>
            {
                const publication_info: Messenger.Publication_Info = new Messenger.Publication_Info(
                    {
                        type: Messenger.Publication_Type.IMMEDIATE,
                        data: this.info.Data(),
                    },
                );

                for (const prefix of [Prefix.BEFORE, Prefix.ON, Prefix.AFTER]) {
                    const promises: Array<Promise<void>> = this.info.Suffixes().map(
                        async function (
                            this: Instance,
                            suffix: Suffix,
                        ):
                            Promise<void>
                        {
                            await this.messenger.Publish(
                                new Name(prefix, this.info.Affix(), suffix).String(),
                                publication_info,
                            );
                        }.bind(this),
                    );
                    promises.push(
                        this.messenger.Publish(
                            new Name(prefix, this.info.Affix()).String(),
                            publication_info,
                        ),
                    );
                    await Promise.all(promises);
                }
            }.bind(this),
        );
    }
};
