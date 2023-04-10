import { Name } from "../../../types.js";

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
            model,
            root,
        }: {
            model: () => Model_Instance,
            root: View_Entity.Instance,
        },
    ): View_Instance;
}

export interface View_Instance extends View_Entity.Instance
{
    Model(): Model_Instance;
}

export class Instance extends Model_Entity.Instance
{
    private model_class: Model_Class;
    private model_instance: Model_Instance;
    private view_class: View_Class;

    constructor(
        {
            model_class,
            model_data = undefined,
            view_class,
        }: {
            model_class: Model_Class,
            model_data?: Model_Data,
            view_class: View_Class,
        },
    )
    {
        super();

        this.model_class = model_class;
        this.model_instance = new model_class(model_data);
        this.view_class = view_class;

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
}
