import * as Utils from "../../utils.js";
import * as Language from "./language.js";
export class Instance {
    constructor({ data, branch, }) {
        this.data = data;
        this.name = branch.name;
        this.path = `${data.Books_Path()}/${branch.name}`;
        this.languages = [];
        for (const language_branch of branch.languages) {
            this.languages.push(new Language.Instance({
                book: this,
                branch: language_branch,
            }));
        }
    }
    Data() {
        return this.data;
    }
    Name() {
        return this.name;
    }
    Path() {
        return this.path;
    }
    Language(language_name) {
        for (const language of this.languages) {
            if (language.Name() === language_name) {
                return language;
            }
        }
        Utils.Assert(false, `Invalid language_name.`);
        return this.languages[0];
    }
    Language_Count() {
        return this.languages.length;
    }
    Language_At(language_index) {
        Utils.Assert(language_index > -1, `language_index must be greater than -1.`);
        Utils.Assert(language_index < this.Language_Count(), `language_index must be less than language_count.`);
        return this.languages[language_index];
    }
    Languages() {
        return Array.from(this.languages);
    }
}
