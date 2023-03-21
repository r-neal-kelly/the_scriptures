export class Instance {
    constructor({ files, name, }) {
        this.files = files;
        this.name = name;
        this.path = `${files.Path()}/${name}`;
    }
    Files() {
        return this.files;
    }
    Name() {
        return this.name;
    }
    Path() {
        return this.path;
    }
}
