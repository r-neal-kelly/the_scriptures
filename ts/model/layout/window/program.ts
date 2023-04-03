import { Name } from "../../../types.js";

import * as Utils from "../../../utils.js";
import * as Async from "../../../async.js";
import * as Entity from "../../../entity.js";

export type Model_Data = any;

export interface Model_Class
{
    new(
        data: Model_Data,
    ): Model_Instance;
}

export interface Model_Instance extends Async.Instance
{
    Title(): Name;
}

export interface View_Class
{
    new(
        {
            model,
            root,
        }: {
            model: () => Model_Instance,
            root: Entity.Instance,
        },
    ): View_Instance;
}

export interface View_Instance extends Entity.Instance
{
}

export class Instance extends Async.Instance
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

        this.Is_Ready_After(
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
