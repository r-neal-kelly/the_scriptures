import * as Files from "./files.js";
export class Instance {
    constructor({ versions, name, }) {
        this.versions = versions;
        this.name = name;
        this.path = `${versions.Path()}/${name}`;
        this.files = new Files.Instance({
            version: this,
        });
    }
    Versions() {
        return this.versions;
    }
    Name() {
        return this.name;
    }
    Path() {
        return this.path;
    }
    Files() {
        return this.files;
    }
}
