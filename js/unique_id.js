const next_id = [0];
export function New() {
    const result = next_id.join(`_`);
    if (next_id[next_id.length - 1] >= Number.MAX_SAFE_INTEGER) {
        next_id.push(0);
    }
    else {
        next_id[next_id.length - 1] += 1;
    }
    return result;
}
