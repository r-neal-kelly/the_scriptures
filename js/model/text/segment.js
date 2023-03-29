import * as Utils from "../../utils.js";
export class Instance {
    constructor() {
        this.parts = [];
    }
    Value() {
        let value = ``;
        for (const part of this.parts) {
            value += part.Value();
        }
        return value;
    }
    Part_Count() {
        return this.parts.length;
    }
    Has_Part(part) {
        return this.parts.indexOf(part) > -1;
    }
    Has_Part_Index(part_index) {
        return (part_index > -1 &&
            part_index < this.parts.length);
    }
    Part(part_index) {
        Utils.Assert(this.Has_Part_Index(part_index), `Does not have a part at the index.`);
        return this.parts[part_index];
    }
    Part_Index(part) {
        const index = this.parts.indexOf(part);
        Utils.Assert(index > -1, `Does not have the part.`);
        return index;
    }
    Parts() {
        return Array.from(this.parts);
    }
    Add_Part(part) {
        const result = this.Try_Add_Part(part);
        Utils.Assert(result === true, `Failed to add part`);
    }
    Try_Add_Part(part) {
        if (this.parts.length === 0) {
            this.parts.push(part);
            return true;
        }
        else {
            const previous_part = this.parts[this.parts.length - 1];
            if (part.Is_Break()) {
                if (!previous_part.Is_Break()) {
                    this.parts.push(part);
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                if (previous_part.Is_Break()) {
                    const previous_value = previous_part.Value();
                    if (/\S/.test(previous_value[previous_value.length - 1])) {
                        this.parts.push(part);
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
        }
    }
}
