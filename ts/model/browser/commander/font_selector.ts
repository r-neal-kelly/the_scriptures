import * as Commander from "./instance";

export class Instance
{
    private commander: Commander.Instance;
    private is_activated: boolean;

    constructor(
        {
            commander,
            is_activated,
        }: {
            commander: Commander.Instance,
            is_activated: boolean,
        },
    )
    {
        this.commander = commander;
        this.is_activated = is_activated;
    }

    Commander():
        Commander.Instance
    {
        return this.commander;
    }

    Symbol():
        string
    {
        if (this.Is_Activated()) {
            return `F`;
        } else {
            return `f`;
        }
    }

    Is_Activated():
        boolean
    {
        return this.is_activated;
    }

    Is_Deactivated():
        boolean
    {
        return !this.Is_Activated();
    }

    Activate():
        void
    {
        this.is_activated = true;
        this.Commander().__Set_Current_Selector__(this);
    }

    Deactivate():
        void
    {
        this.is_activated = false;
        this.Commander().__Unset_Current_Selector__();
    }

    Toggle():
        void
    {
        if (this.Is_Activated()) {
            this.Deactivate();
        } else {
            this.Activate();
        }
    }
}
