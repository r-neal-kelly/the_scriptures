import * as Entity from "../../../entity.js";
export class Instance extends Entity.Instance {
    constructor({ bar, }) {
        super();
        this.bar = bar;
        this.Add_Dependencies([]);
    }
    Bar() {
        return this.bar;
    }
    Value() {
        if (this.Bar().Window().Is_Ready()) {
            return this.Bar().Window().Program().Model_Instance().Title();
        }
        else {
            return ``;
        }
    }
}
