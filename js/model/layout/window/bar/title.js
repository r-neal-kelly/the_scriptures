export class Instance {
    constructor({ bar, }) {
        this.bar = bar;
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
