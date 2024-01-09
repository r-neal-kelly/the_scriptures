import * as Taskbar from "./taskbar.js";

export class Instance
{
    private taskbar: Taskbar.Instance;

    constructor(
        {
            taskbar,
        }: {
            taskbar: Taskbar.Instance,
        },
    )
    {
        this.taskbar = taskbar;
    }

    Taskbar():
        Taskbar.Instance
    {
        return this.taskbar;
    }

    Symbol():
        string
    {
        if (this.Taskbar().Layout().Desktop().Menu().Is_Open()) {
            return `-`;
        } else {
            return `=`;
        }
    }

    Should_Open():
        boolean
    {
        return this.Taskbar().Layout().Desktop().Menu().Is_Closed();
    }

    Should_Close():
        boolean
    {
        return this.Taskbar().Layout().Desktop().Menu().Is_Open();
    }
}
