import * as Utils from "../../utils.js";
import * as Version from "./version.js";
export class Instance {
    constructor({ book, branch, }) {
        this.book = book;
        this.name = branch.name;
        this.path = `${book.Path()}/${branch.name}`;
        this.versions = [];
        for (const version_branch of branch.versions) {
            this.versions.push(new Version.Instance({
                language: this,
                branch: version_branch,
            }));
        }
    }
    Book() {
        return this.book;
    }
    Name() {
        return this.name;
    }
    Path() {
        return this.path;
    }
    Version(version_name) {
        for (const version of this.versions) {
            if (version.Name() === version_name) {
                return version;
            }
        }
        Utils.Assert(false, `Invalid version_name.`);
        return this.versions[0];
    }
    Version_Count() {
        return this.versions.length;
    }
    Version_At(version_index) {
        Utils.Assert(version_index > -1, `version_index must be greater than -1.`);
        Utils.Assert(version_index < this.Version_Count(), `version_index must be less than version_count.`);
        return this.versions[version_index];
    }
    Versions() {
        return Array.from(this.versions);
    }
}
