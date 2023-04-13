import * as Item from "./item.js";
export function From(break_) {
    const results = [];
    const matches = break_.Value().match(/\S+|\s/g);
    if (matches != null) {
        let index = 0;
        for (const match of matches) {
            results.push(new Instance({
                break_: break_,
                from: index,
                to: index += match.length,
            }));
        }
    }
    return results;
}
export class Instance extends Item.Instance {
    constructor({ break_, from, to, }) {
        super({
            item_type: Item.Type.SPLIT,
        });
        this.break_ = break_;
        this.from = from;
        this.to = to;
        this.value = break_.Value().slice(from, to);
    }
    Break() {
        return this.break_;
    }
    From() {
        return this.from;
    }
    To() {
        return this.to;
    }
    Value() {
        return this.value;
    }
}
