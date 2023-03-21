import * as Versions from "./versions.js";
export class Instance {
    constructor({ languages, name, }) {
        this.languages = languages;
        this.name = name;
        this.path = `${languages.Path()}/${name}`;
        this.versions = new Versions.Instance({
            language: this,
        });
    }
    Languages() {
        return this.languages;
    }
    Name() {
        return this.name;
    }
    Path() {
        return this.path;
    }
    Versions() {
        return this.versions;
    }
}
