export class Type_And_Name {
    constructor({ type, name = null, }) {
        this.type = type;
        this.name = name;
    }
    Type() {
        return this.type;
    }
    Name() {
        return this.name;
    }
}
