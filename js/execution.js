var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Utils from "./utils.js";
import * as Queue from "./queue.js";
export var Type;
(function (Type) {
    /* Immediately executes, even if queued executors are executing. */
    Type[Type["IMMEDIATE"] = 0] = "IMMEDIATE";
    /* Waits to execute until previous executors in the queue finish. */
    Type[Type["QUEUED"] = 1] = "QUEUED";
    /*
        Waits to execute when no other executors are executing,
        makes subsequent immediate and queued executors wait,
        and discards other exclusive executors while its executing.
    */
    Type[Type["EXCLUSIVE"] = 2] = "EXCLUSIVE";
})(Type || (Type = {}));
export class Frame {
    constructor() {
        this.immediate_count = 0;
        this.queued = new Queue.Instance();
        this.has_exclusive = false;
    }
    Execute(type, executor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (type === Type.IMMEDIATE) {
                while (this.has_exclusive === true) {
                    yield Utils.Wait_Milliseconds(1);
                }
                this.immediate_count += 1;
                yield executor();
                this.immediate_count -= 1;
            }
            else if (type === Type.QUEUED) {
                while (this.has_exclusive === true) {
                    yield Utils.Wait_Milliseconds(1);
                }
                yield this.queued.Enqueue(executor);
            }
            else if (type === Type.EXCLUSIVE) {
                if (this.has_exclusive === false) {
                    this.has_exclusive = true;
                    yield Promise.all([
                        (function () {
                            return __awaiter(this, void 0, void 0, function* () {
                                while (this.immediate_count > 0) {
                                    yield Utils.Wait_Milliseconds(1);
                                }
                            });
                        }.bind(this))(),
                        this.queued.Pause(),
                    ]);
                    yield executor();
                    this.queued.Unpause();
                    this.has_exclusive = false;
                }
            }
            else {
                Utils.Assert(false, `Unknown type.`);
            }
        });
    }
}
