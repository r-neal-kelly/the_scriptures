export class Instance {
    constructor({ italic = false, bold = false, underline = false, small_caps = false, error = false, }) {
        this.italic = italic;
        this.bold = bold;
        this.underline = underline;
        this.small_caps = small_caps;
        this.error = error;
    }
    Italic() {
        return this.italic;
    }
    Bold() {
        return this.bold;
    }
    Underline() {
        return this.underline;
    }
    Small_Caps() {
        return this.small_caps;
    }
    Error() {
        return this.error;
    }
}
