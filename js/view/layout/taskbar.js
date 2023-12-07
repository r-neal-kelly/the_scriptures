import*as Utils from"../../utils.js";import*as Entity from"../entity.js";import*as Tabs from"./tabs.js";export class Instance extends Entity.Instance{constructor({model:n,layout:e}){super({element:"div",parent:e,event_grid:e.Event_Grid()}),this.model=n,this.Live()}On_Life(){return this.Add_This_CSS("\n                .Taskbar {\n                    width: 100%;\n                    height: 100%;\n                    padding: 0 2px;\n\n                    overflow-x: hidden;\n                    overflow-y: hidden;\n\n                    border-color: white;\n                    border-style: solid;\n                    border-width: 1px 0 0 0;\n                }\n            "),this.Add_Children_CSS("\n                .Tabs {\n                    display: flex;\n                    flex-direction: row;\n                    justify-content: space-around;\n\n                    width: 100%;\n                    height: 100%;\n\n                    overflow-x: auto;\n                    overflow-y: hidden;\n                }\n\n                .Tab {\n                    padding: 2px;\n\n                    border-color: white;\n                    border-style: solid;\n                    border-width: 0 1px;\n\n                    font-size: 0.8em;\n                    text-align: center;\n\n                    cursor: pointer;\n                    -webkit-user-select: none;\n                    -moz-user-select: none;\n                    -ms-user-select: none;\n                    user-select: none;\n                }\n\n                .Active_Tab {\n                    color: black;\n                    background-color: white;\n                    border-color: black;\n                }\n            "),[]}On_Refresh(){this.Has_Tabs()||(this.Abort_All_Children(),new Tabs.Instance({model:()=>this.Model().Tabs(),taskbar:this}))}On_Reclass(){return["Taskbar"]}Model(){return this.model()}Layout(){return this.Parent()}Has_Tabs(){return this.Has_Child(0)&&this.Child(0)instanceof Tabs.Instance}Tabs(){return 0,this.Child(0)}}