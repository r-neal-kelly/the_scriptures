import*as Model from"../../../model/buffer/search/instance.js";import*as Model_Languages from"../../../model/languages.js";import*as Entity from"../../entity.js";import*as Line from"./line.js";export class Instance extends Entity.Instance{constructor({parent:n,model:e,event_grid_id:t}){super({element:"div",parent:n,event_grid:n.Event_Grid()}),this.model=e,this.event_grid_id=t,this.Live()}On_Life(){return this.Add_CSS("\n                .Left_To_Right {\n                    direction: ltr;\n                }\n\n                .Right_To_Left {\n                    direction: rtl;\n                }\n            "),this.Add_This_CSS("\n                .Search {\n                    width: 100%;\n                    padding: 12px 4px 36px 4px;\n\n                    overflow-x: auto;\n                    overflow-y: auto;\n                }\n            "),this.Add_Children_CSS("\n                .Line {\n                    display: block;\n\n                    padding: 3px 0px;\n\n                    border-bottom: solid 1px rgba(255, 255, 255, 0.5);\n\n                    color: inherit;\n                }\n\n                .Centered_Line {\n                    display: flex;\n                    flex-wrap: wrap;\n                    justify-content: center;\n\n                    text-align: center;\n                }\n\n                .Segment {\n                    display: inline-block;\n\n                    color: inherit;\n                }\n\n                .Item {\n                    display: inline-block;\n\n                    width: auto;\n\n                    border-style: solid;\n                    border-width: 0 0 2px 0;\n                    border-color: transparent;\n\n                    color: inherit;\n                    font-style: normal;\n                    font-weight: normal;\n                    font-variant: normal;\n                    text-decoration: none;\n                }\n                \n                .Indented_Item {\n                    width: 3em;\n                }\n\n                .Division {\n                    display: inline-block;\n                }\n\n                .Highlighted_Division {\n                    min-width: 3px;\n                    \n                    background-color: white;\n\n                    color: black;\n                }\n\n                .Blank {\n                    display: none;\n\n                    color: transparent;\n                }\n\n                .Transparent {\n                    color: transparent;\n                }\n\n                .Italic {\n                    font-style: italic;\n                }\n\n                .Bold {\n                    font-weight: bold;\n                }\n\n                .Underline {\n                    text-decoration: underline;\n                }\n\n                .Small_Caps {\n                    font-variant: small-caps;\n                }\n\n                .Error {\n                    border-color: #ffcbcb;\n\n                    color: #ffcbcb;\n                }\n            "),[]}On_Refresh(){const n=this.Model(),e=Math.max(Model.Instance.Min_Line_Count(),n.Line_Count());for(let n=this.Child_Count(),t=e;n<t;n+=1)new Line.Instance({text:this,model:()=>this.Model().Line_At(n)})}On_Reclass(){const n=[];return n.push("Search"),this.Model().Default_Text_Direction()===Model_Languages.Direction.LEFT_TO_RIGHT?n.push("Left_To_Right"):n.push("Right_To_Left"),n}On_Restyle(){return this.Model().Default_Text_Styles()}Model(){return this.model()}Event_Grid_ID(){return this.event_grid_id()}}