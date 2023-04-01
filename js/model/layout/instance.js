var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Wall from "./wall.js";
import * as Bar from "./bar.js";
export class Instance {
    constructor() {
        this.wall = new Wall.Instance({
            layout: this,
        });
        this.bar = new Bar.Instance({
            layout: this,
        });
    }
    Wall() {
        return this.wall;
    }
    Bar() {
        return this.bar;
    }
    Add_Window({ model_class, view_class, model_data = undefined, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.Wall().Add_With({
                model_class,
                view_class,
                model_data,
            });
        });
    }
}
