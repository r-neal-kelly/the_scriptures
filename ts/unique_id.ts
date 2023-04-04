import { Integer } from "./types.js";
import { ID } from "./types.js";

const next_id: Array<Integer> = [0];

export function New():
    ID
{
    const result: ID = next_id.join(`_`);

    if (next_id[next_id.length - 1] >= Number.MAX_SAFE_INTEGER) {
        next_id.push(0);
    } else {
        next_id[next_id.length - 1] += 1;
    }

    return result;
}
