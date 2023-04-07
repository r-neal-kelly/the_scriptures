import * as Uniques from "./uniques.js";
import * as Occurrences from "./occurrences.js";
export class Instance {
    constructor({ version, }) {
        this.version = version;
        this.name = `Search`;
        this.path = `${version.Path()}/${this.name}`;
        this.uniques = new Uniques.Instance({
            search: this,
        });
        this.occurrences = new Occurrences.Instance({
            search: this,
        });
    }
    Version() {
        return this.version;
    }
    Name() {
        return this.name;
    }
    Path() {
        return this.path;
    }
    Uniques() {
        return this.uniques;
    }
    Occurrences() {
        return this.occurrences;
    }
}
