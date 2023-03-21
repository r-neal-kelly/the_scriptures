import * as Utils from "./utils.js";
import * as Messenger from "./messenger.js";

export class Grid
{
    private messenger: Messenger.Instance;
    private objects: Map<Object, Listeners>;

    constructor()
    {
        this.messenger = new Messenger.Instance();
        this.objects = new Map();
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

    async Send(
        event_info: Info,
    ):
        Promise<void>
    {
        await new Instance(this.messenger, event_info).Start();
    }
};

export type Handler =
    Messenger.Subscriber_Handler;

export type Priority =
    Messenger.Subscriber_Priority;

export type Listener_Info = {
    event_name: Name,
    event_handler: Handler,
    event_priority: Priority,
};

export type Listener_Handle =
    Messenger.Subscription;

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
            listener_info.event_name.String(),
            {
                handler: listener_info.event_handler.bind(object),
                priority: listener_info.event_priority,
            } as Messenger.Subscriber_Info,
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

export type Affix =
    string;

export type Suffix =
    string;

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
    }

    String():
        string
    {
        return this.text;
    }
};

export enum Execution
{
    QUEUED = Messenger.Publication_Execution.QUEUED,
    EXCLUSIVE = Messenger.Publication_Execution.EXCLUSIVE,
}

export type Data
    = Object;

export type Info = {
    affix: Affix,
    suffixes?: Array<Suffix>,
    execution?: Execution,
    data?: Data,
};

class Instance
{
    private messenger: Messenger.Instance;

    private affix: Affix;
    private suffixes: Array<Suffix>;
    private execution: Execution;
    private data: Data;

    private is_started: boolean;
    private is_stopped: boolean;

    constructor(
        messenger: Messenger.Instance,
        {
            affix,
            suffixes = [],
            data = {},
            execution = Execution.QUEUED,
        }: Info,
    )
    {
        Utils.Assert(
            (data as any)["event"] == null,
            `data contains a property called 'event' which will be overridden.`,
        );
        Utils.Assert(
            !Object.isFrozen(data),
            `data must not be frozen to add the event to it. It will then be frozen for you.`,
        );

        (data as any)["event"] = this;

        this.messenger = messenger;

        this.affix = affix;
        this.suffixes = Array.from(suffixes);
        this.execution = execution;
        this.data = Object.freeze(data);

        this.is_started = false;
        this.is_stopped = false;
    }

    Is_Started():
        boolean
    {
        return this.is_started;
    }

    Is_Stopped():
        boolean
    {
        return this.is_stopped;
    }

    Is_Running():
        boolean
    {
        return this.Is_Started() && !this.Is_Stopped;
    }

    async Start():
        Promise<void>
    {
        Utils.Assert(
            !this.Is_Started(),
            `This event has already been started.`,
        );

        const publication_info = Object.freeze(
            {
                execution: this.execution as unknown as Messenger.Publication_Execution,
                data: this.data,
            },
        );

        for (const prefix of [Prefix.BEFORE, Prefix.ON, Prefix.AFTER]) {
            if (!this.Is_Stopped()) {
                const promises: Array<Promise<void>> = this.suffixes.map(
                    async function (
                        this: Instance,
                        suffix: Suffix,
                    ):
                        Promise<void>
                    {
                        await this.messenger.Publish(
                            new Name(prefix, this.affix, suffix).String(),
                            publication_info,
                        );
                    }.bind(this),
                );
                promises.push(
                    this.messenger.Publish(
                        new Name(prefix, this.affix).String(),
                        publication_info,
                    ),
                );
                await Promise.all(promises);
            }
        }

        this.Stop();
    }

    /*
        Stops subsequent waves of the event, i.e.
        if this is called during the 'Before' wave,
        'On' and 'After' waves will never occur.
    */
    Stop():
        void
    {
        this.is_stopped = true;
    }
};
export type { Instance };
