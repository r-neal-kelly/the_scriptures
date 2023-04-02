import * as Utils from "../../../utils.js";
import * as Async from "../../../async.js";
export class Instance extends Async.Instance {
    constructor({ model_class, model_data = undefined, view_class, }) {
        super();
        this.model_class = model_class;
        this.model_instance = new model_class(model_data);
        this.view_class = view_class;
        this.Is_Ready_After([
            this.model_instance,
        ]);
    }
    Model_Class() {
        Utils.Assert(this.Is_Ready(), `Program must be ready to get its model_class.`);
        return this.model_class;
    }
    Model_Instance() {
        Utils.Assert(this.Is_Ready(), `Program must be ready to get its model_instance.`);
        return this.model_instance;
    }
    View_Class() {
        Utils.Assert(this.Is_Ready(), `Program must be ready to get its view_class.`);
        return this.view_class;
    }
}
