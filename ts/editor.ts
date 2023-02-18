function Assert(
    boolean_statement: boolean
):
    void
{
    if (boolean_statement === false) {
        throw new Error(`Failed assert.`);
    }
}

class Text_Editor
{
    private name: string;

    private parent: HTMLElement;
    private children: {
        wrapper: HTMLDivElement,

        commands: HTMLDivElement,
        input: HTMLInputElement,
        load_button: HTMLDivElement,
        save_button: HTMLDivElement,

        name: HTMLDivElement,

        editor: HTMLDivElement,
    };

    constructor(
        {
            name = `new_text`,
            parent,
        }: {
            name?: string,
            parent: HTMLElement,
        },
    )
    {
        this.name = name;

        this.parent = parent;
        this.children = {
            wrapper: document.createElement(`div`),

            commands: document.createElement(`div`),
            input: document.createElement(`input`),
            load_button: document.createElement(`div`),
            save_button: document.createElement(`div`),

            name: document.createElement(`div`),

            editor: document.createElement(`div`),
        };

        this.children.wrapper.setAttribute(
            `style`,
            `
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                height: 90%;
                width: 90%;
                padding: 2px;

                border-width: 0;

                background-color: blue;
                color: white;

                overflow-y: auto;
            `,
        );

        this.children.commands.setAttribute(
            `style`,
            `
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;

                width: 100%;
                height: 5%;
            `,
        );

        this.children.input.setAttribute(
            `type`,
            `file`,
        );
        this.children.input.setAttribute(
            `accept`,
            `text/plain`,
        );
        this.children.input.setAttribute(
            `style`,
            `
                display: none;
            `,
        );
        this.children.input.addEventListener(
            `input`,
            async function (
                this: Text_Editor,
                event: Event,
            ):
                Promise<void>
            {
                if (this.children.input.files && this.children.input.files[0]) {
                    const file: File = this.children.input.files[0];
                    const file_text: string = await file.text();
                    this.Set_Name(file.name);
                    this.Set_Text(file_text);

                    Assert(this.Get_Text() === file_text.replaceAll(/\r/g, ``));
                }
            }.bind(this),
        );

        this.children.load_button.setAttribute(
            `style`,
            `
                width: 50%;
                height: 100%;
            `,
        );
        this.children.load_button.textContent = `Load`;
        this.children.load_button.addEventListener(
            `click`,
            function (
                this: Text_Editor,
                event: Event,
            ):
                void
            {
                this.children.input.click();
            }.bind(this),
        );

        this.children.save_button.setAttribute(
            `style`,
            `
                width: 50%;
                height: 100%;
            `,
        );
        this.children.save_button.textContent = `Save`;
        this.children.save_button.addEventListener(
            `click`,
            function (
                this: Text_Editor,
                event: Event,
            ):
                void
            {
                this.Save_Text();
            }.bind(this),
        );

        this.children.name.setAttribute(
            `style`,
            `
                width: 100%;
                height: 5%;
            `,
        );
        this.Set_Name(name);

        this.children.editor.setAttribute(
            `contenteditable`,
            `true`,
        );
        this.children.editor.setAttribute(
            `spellcheck`,
            `false`,
        );
        this.children.editor.setAttribute(
            `style`,
            `
                width: 100%;
                height: 90%;
            `,
        );
        this.children.editor.innerHTML = `<div></div>`;

        this.children.commands.appendChild(this.children.input);
        this.children.commands.appendChild(this.children.load_button);
        this.children.commands.appendChild(this.children.save_button);

        this.children.wrapper.appendChild(this.children.commands);
        this.children.wrapper.appendChild(this.children.name);
        this.children.wrapper.appendChild(this.children.editor);

        this.parent.appendChild(this.children.wrapper);
    }

    Get_Name():
        string
    {
        return this.name;
    }

    Set_Name(
        name: string,
    ):
        void
    {
        this.name = name.replace(/\..+$/, ``);
        this.children.name.textContent = this.name;
    }

    Get_Text():
        string
    {
        return this.children.editor.innerHTML
            .replace(/^\<div\>/, ``)
            .replace(/\<\/div\>$/, ``)
            .replaceAll(/\<br\>/g, ``)
            .replaceAll(/\<\/div\>\<div\>/g, `\n`)
            .replaceAll(/(\<div\>)|(\<\/div\>)/g, ``);
    }

    Set_Text(
        text: string,
    ):
        void
    {
        this.children.editor.innerHTML =
            text.split(
                /\r?\n/,
            ).map(
                function (line: string):
                    string
                {
                    if (line === ``) {
                        line = `<br>`;
                    } else {
                        line = line.replaceAll(
                            /./g,
                            function (character: string):
                                string
                            {
                                return `&#${character.charCodeAt(0)};`;
                            }
                        );
                    }

                    return `<div>${line}</div>`;
                },
            ).join(
                ``,
            );
    }

    Save_Text():
        void
    {
        const text: string = this.Get_Text();
        const name: string = this.Get_Name();
        const file: File = new File([text], `${name}.txt`);
        const file_url: string = URL.createObjectURL(file);
        const link = document.createElement(`a`);

        link.href = file_url;
        link.download = `${name}.txt`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function Style():
    void
{
    const style = document.createElement(`style`);

    style.setAttribute(
        `type`,
        `text/css`,
    );

    style.appendChild(
        document.createTextNode(
            `
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                *:focus {
                    outline: 0;
                }
                
                html, body {
                    width: 100%;
                    height: 100%;
                    background-color: black;
                }

                body {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
            `,
        ),
    );

    document.head.appendChild(style);
}

function Build():
    void
{
    const text_editor: Text_Editor = new Text_Editor(
        {
            parent: document.body,
        },
    );
}

function Main():
    void
{
    Style();
    Build();
}

Main();
