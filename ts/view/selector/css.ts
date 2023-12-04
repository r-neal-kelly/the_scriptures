export function This_CSS():
    string
{
    return `
        .Selector {
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr;

            justify-items: stretch;
            align-items: stretch;
            justify-content: start;
            align-content: start;

            position: absolute;
            left: 0;
            top: 0;
            z-index: 1;

            width: 100%;
            height: 100%;

            background-color: hsl(0, 0%, 0%, 0.7);

            overflow-x: hidden;
            overflow-y: hidden;
        }
    `;
}

export function Children_CSS():
    string
{
    return `
        .Slots {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: 1fr;
            
            justify-items: stretch;
            align-items: stretch;
            justify-content: start;
            align-content: start;

            width: 100%;
            height: 100%;

            overflow-x: hidden;
            overflow-y: hidden;
        }

        .Slot {
            display: grid;
            grid-template-rows: auto auto;
            grid-template-columns: auto;
            align-content: start;

            width: 100%;
            height: 100%;
            padding: 0 3px;

            border-color: white;
            border-style: solid;
            border-width: 0 1px 0 0;

            overflow-x: hidden;
            overflow-y: hidden;
        }

        .Slot_Title {
            width: 100%;
        
            overflow-x: hidden;
            overflow-y: hidden;

            background-color: transparent;
            color: white;

            border-color: white;
            border-style: solid;
            border-width: 0 0 1px 0;

            font-variant: small-caps;

            cursor: default;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .Slot_Items {
            width: 100%;

            padding: 2px 2px;

            overflow-x: auto;
            overflow-y: auto;
        }

        .Slot_Item {
            width: 100%;
            padding: 4px 2px;

            /*border-bottom: solid 1px rgba(255, 255, 255, 0.3);*/
            
            overflow-x: hidden;
            overflow-y: hidden;

            background-color: transparent;
            color: white;
            
            text-align: center;

            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
        
        .Slot_Item_Selected {
            background-color: white;
            color: black;
        }
    `;
}

export function CSS():
    string
{
    return `
        .Invisible {
            display: none;
        }
    `;
}
