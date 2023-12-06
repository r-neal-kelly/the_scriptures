import { Name } from "../../../types.js";
import { ID } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Model_Entity from "../../../model/entity.js";
import * as View_Entity from "../../../view/entity.js";

export type Model_Data = any;

export interface Model_Class
{
    new(
        data: Model_Data,
    ): Model_Instance;
}

export interface Model_Instance extends Model_Entity.Instance
{
    Title(): Name;
    Short_Title(): Name;
}

export interface View_Class
{
    new(
        {
            parent,
            model,
            event_grid_hook,
        }: {
            parent: View_Entity.Instance,
            model: () => Model_Instance,
            event_grid_hook: () => ID,
        },
    ): View_Instance;
}

export interface View_Instance extends View_Entity.Instance
{
    Model(): Model_Instance;
    Event_Grid_Hook(): ID;
}

export class Instance extends Model_Entity.Instance
{
    private model_class: Model_Class;
    private model_instance: Model_Instance;
    private view_class: View_Class;
    private is_window_active: boolean;
    private is_window_minimized: boolean;
    private is_window_maximized: boolean;

    constructor(
        {
            model_class,
            model_data = undefined,
            view_class,
            is_window_active = true,
            is_window_minimized = false,
            is_window_maximized = false,
        }: {
            model_class: Model_Class,
            model_data?: Model_Data,
            view_class: View_Class,
            is_window_active?: boolean,
            is_window_minimized?: boolean,
            is_window_maximized?: boolean,
        },
    )
    {
        super();

        this.model_class = model_class;
        this.model_instance = new model_class(model_data);
        this.view_class = view_class;
        this.is_window_active = is_window_active;
        this.is_window_minimized = is_window_maximized ? false : is_window_minimized;
        this.is_window_maximized = is_window_maximized;

        this.Add_Dependencies(
            [
                this.model_instance,
            ],
        );
    }

    Model_Class():
        Model_Class
    {
        Utils.Assert(
            this.Is_Ready(),
            `Program must be ready to get its model_class.`,
        );

        return this.model_class;
    }

    Model_Instance():
        Model_Instance
    {
        Utils.Assert(
            this.Is_Ready(),
            `Program must be ready to get its model_instance.`,
        );

        return this.model_instance;
    }

    View_Class():
        View_Class
    {
        Utils.Assert(
            this.Is_Ready(),
            `Program must be ready to get its view_class.`,
        );

        return this.view_class;
    }

    Is_Window_Active():
        boolean
    {
        return this.is_window_active;
    }

    Is_Window_Minimized():
        boolean
    {
        return this.is_window_minimized;
    }

    Is_Window_Maximized():
        boolean
    {
        return this.is_window_maximized;
    }
}
