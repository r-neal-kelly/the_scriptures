import*as Text_Base from"../text_base.js";import*as Line from"./line.js";export class Instance extends Text_Base.Instance{constructor({parent:n,model:e,event_grid_hook:i}){super({parent:n,model:e,event_grid_hook:i}),this.Live()}On_Life(){const n=super.On_Life();return this.Add_This_CSS("\n                .Search_Text {\n                    overflow-x: auto;\n                    overflow-y: auto;\n                }\n            "),this.Add_Children_CSS("\n                .Search_Line {\n                    border-bottom: solid 1px rgba(255, 255, 255, 0.5);\n                }\n\n                .Division {\n                    display: inline-block;\n                }\n\n                .Highlighted_Division {\n                    min-width: 3px;\n                    \n                    background-color: white;\n\n                    color: black;\n                }\n\n                .Blank_Division {\n                    display: none;\n\n                    color: transparent;\n                }\n            "),n}On_Reclass(){const n=super.On_Reclass();return n.push("Search_Text"),n}Add_Line(n){new Line.Instance({buffer:this,model:()=>this.Model().Line_At(n)})}}