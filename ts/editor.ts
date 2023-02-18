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
    private wrapper: HTMLDivElement;
    private editor: HTMLDivElement;
    private input: HTMLInputElement;

    constructor(
        {
            name = `new_text`,
            parent,
            style,
        }: {
            name?: string,
            parent: HTMLElement,
            style: string,
        },
    )
    {
        this.name = name;

        this.parent = parent;

        this.wrapper = document.createElement(`div`);
        this.wrapper.setAttribute(
            `style`,
            style,
        );

        this.editor = document.createElement(`div`);
        this.editor.setAttribute(
            `contenteditable`,
            `true`,
        );
        this.editor.setAttribute(
            `style`,
            `
                width: 100%;
                height: 100%;
            `,
        );
        this.editor.innerHTML = `<div></div>`;

        this.input = document.createElement(`input`);
        this.input.setAttribute(
            `type`,
            `file`,
        );
        this.input.setAttribute(
            `accept`,
            `text/plain`,
        );
        this.input.setAttribute(
            `style`,
            `
                display: block;
            `,
        );
        this.input.addEventListener(
            `input`,
            async function (
                this: Text_Editor,
                event: Event,
            ):
                Promise<void>
            {
                if (this.input.files && this.input.files[0]) {
                    const file: File = this.input.files[0];
                    const file_text: string = await file.text();
                    this.Set_Text(file_text);

                    Assert(this.Get_Text() === file_text.replaceAll(/\r/g, ``));

                    this.Save_Text(); // temp
                }
            }.bind(this),
        );

        this.wrapper.appendChild(this.input);
        this.wrapper.appendChild(this.editor);
        this.parent.appendChild(this.wrapper);
    }

    Get_Name():
        string
    {
        return this.name;
    }

    Get_Text():
        string
    {
        return this.editor.innerHTML
            .replace(/^\<div\>/, ``)
            .replace(/\<\/div\>$/, ``)
            .replaceAll(/\<br\>/g, ``)
            .replaceAll(/\<\/div\>\<div\>/g, `\n`)
    }

    Set_Text(
        text: string,
    ):
        void
    {
        this.editor.innerHTML =
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
            style: `
                height: 300px;
                width: 90%;
                padding: 2px;

                border-width: 0;

                background-color: blue;
                color: white;

                overflow-y: auto;
            `,
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
