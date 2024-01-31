import*as Language from"../../../model/language.js";import*as Languages from"../../../model/languages.js";import*as Font from"../../../model/font.js";import{Script_Position}from"../../../model/script_position.js";import*as Entity from"../../entity.js";export class Instance extends Entity.Instance{constructor({parent:n,model:e,event_grid_hook:t}){super({element:"div",parent:n,event_grid:n.Event_Grid()}),this.model=e,this.event_grid_hook=t}On_Life(){return this.Add_CSS("\n                .Left_To_Right {\n                    direction: ltr;\n                }\n\n                .Right_To_Left {\n                    direction: rtl;\n                }\n            "),this.Add_This_CSS("\n                .Text {\n                    display: grid;\n                    justify-items: stretch;\n                    align-items: stretch;\n                    justify-content: stretch;\n                    align-content: stretch;\n\n                    width: 100%;\n                    padding: 12px 4px 36px 4px;\n                }\n            "),this.Add_Children_CSS(`\n                .Line {\n                    display: grid;\n                    column-gap: 3%;\n                    row-gap: 0;\n                    justify-items: stretch;\n                    align-items: stretch;\n                    justify-content: stretch;\n                    align-content: stretch;\n\n                    width: 100%;\n\n                    margin: 0.35em 0;\n                    padding: 0 0;\n\n                    color: inherit;\n                }\n\n                .Tabular_Line {\n                    justify-self: center;\n                    align-self: center;\n\n                    margin: 0;\n                    padding: 0.35em;\n\n                    border-bottom: solid 1px rgba(255, 255, 255, 0.3);\n                    border-left: solid 1px rgba(255, 255, 255, 0.3);\n                    border-right: solid 1px rgba(255, 255, 255, 0.3);\n                }\n\n                .First_Tabular_Line {\n                    border-top: solid 1px rgba(255, 255, 255, 0.3);\n                }\n\n                .Marginal_Line {\n\n                }\n\n                .Interlinear_Line {\n                    display: flex;\n                    flex-wrap: wrap;\n                    column-gap: 0;\n                    row-gap: 0;\n\n                    margin: 0.20em 0em 0.35em 0em;\n                }\n\n                .Forward_Interlinear_Line {\n                    flex-direction: row;\n                }\n\n                .Reverse_Interlinear_Line {\n                    flex-direction: row-reverse;\n                }\n\n                .Centered_Interlinear_Line {\n                    justify-content: center;    \n                }\n\n                .Padded_Interlinear_Line {\n                    justify-self: stretch;\n                    align-self: stretch;\n\n                    width: auto;\n                    \n                    padding: 0 1em;\n                    \n                    border-style: solid;\n                    border-width: 0 0 0 0;\n                    border-color: rgba(255, 255, 255, 0.4);\n                }\n                \n                .Column {\n                    display: grid;\n                    column-gap: 0;\n                    justify-items: stretch;\n                    align-items: stretch;\n                    justify-content: stretch;\n                    align-content: stretch;\n\n                    margin: 0;\n                    padding: 0;\n                }\n\n                .Marginal_Column {\n                    font-size: .85em;\n                }\n\n                .Inter_Marginal_Column {\n                    \n                }\n\n                .Interlinear_Column {\n                    align-items: center;\n\n                    padding: 0.15em 0;\n                    \n                    border-bottom: solid 1px rgba(255, 255, 255, 0.3);\n                }\n\n                .Inter_Interlinear_Column {\n                    align-items: center;\n                    \n                    padding: 0.15em 0;\n                }\n\n                .Fully_Tabular_Column {\n                    align-items: center;\n                    align-content: center;\n                }\n\n                .Row {\n                    display: block;\n\n                    margin: 0;\n                    padding: 0;\n                }\n\n                .Transparent_Row {\n                    color: transparent;\n                }\n\n                .Centered_Row {\n                    display: flex;\n                    flex-wrap: wrap;\n                    justify-content: center;\n\n                    text-align: center;\n                }\n\n                .Padded_Row {\n                    padding: 0 1em;\n                    \n                    border-style: solid;\n                    border-width: 0 0 0 0;\n                    border-color: rgba(255, 255, 255, 0.4);\n                }\n\n                .Segment {\n                    display: inline-block;\n\n                    color: inherit;\n                }\n\n                .Item {\n                    display: inline-block;\n\n                    width: auto;\n\n                    border-style: solid;\n                    border-width: 0 0 2px 0;\n                    border-color: transparent;\n\n                    color: inherit;\n                    font-style: normal;\n                    font-weight: normal;\n                    font-variant: normal;\n                    text-decoration: none;\n                }\n                \n                .Indented_Item {\n                    width: ${this.Indent_EM()}em;\n                }\n\n                .Image_Item {\n                    max-width: 100%;\n                    max-height: 90vh;\n\n                    vertical-align: middle;\n                }\n\n                .Italic_Item {\n                    font-style: italic;\n                }\n\n                .Bold_Item {\n                    font-weight: bold;\n                }\n\n                .Underlined_Item {\n                    text-decoration: underline;\n                }\n\n                .Small_Caps_Item {\n                    font-variant: small-caps;\n                }\n\n                .Superscript_Item {\n                    /* font-variant-position might be nice, but still experimental in chromium */\n\n                    font-size: ${Font.Consts.SUPERSCRIPT_FONT_SIZE_MULTIPLIER}em;\n                    line-height: ${Font.Consts.SUPERSCRIPT_LINE_HEIGHT_MULTIPLIER}em;\n                    vertical-align: super;\n                }\n\n                .Subscript_Item {\n                    /* font-variant-position might be nice, but still experimental in chromium */\n\n                    font-size: ${Font.Consts.SUBSCRIPT_FONT_SIZE_MULTIPLIER}em;\n                    line-height: ${Font.Consts.SUBSCRIPT_LINE_HEIGHT_MULTIPLIER}em;\n                    vertical-align: sub;\n                }\n\n                .Error_Item {\n                    border-color: #ffcbcb;\n\n                    color: #ffcbcb;\n                }\n\n                .Argument_Item {\n                    \n                }\n\n                .Blank {\n                    display: none;\n\n                    color: transparent;\n                }\n            `),[]}On_Refresh(){const n=this.Model(),e=this.Child_Count(),t=Math.max(n.Line_Buffer_Count(),n.Line_Count());if(e<t)for(let n=e,i=t;n<i;n+=1)this.Add_Line(n);else if(e>t)for(let n=e,i=t;n>i;)n-=1,this.Abort_Child(this.Child(n))}On_Reclass(){const n=[];return n.push("Text"),this.Model().Default_Language_Direction()===Language.Direction.LEFT_TO_RIGHT?n.push("Left_To_Right"):n.push("Right_To_Left"),n}On_Restyle(){return this.Default_Font_Styles(Script_Position.DEFAULT)}On_Resize(){this.Skip_Children()}Model(){return this.model()}Event_Grid_Hook(){return this.event_grid_hook()}Indent_EM(){return 3}Pad_EM(n){return n>0?this.Indent_EM()*n:0}Default_Font_Styles(n){const e=this.Model();return Languages.Singleton().Font_Styles(e.Default_Language_Name(),e.Default_Font_Name(),e.Underlying_Font_Size_PX(),n)}Override_Font_Styles(n,e){const t=this.Model();return Languages.Singleton().Font_Styles(n,t.Override_Font_Name(n),t.Underlying_Font_Size_PX(),e)}}