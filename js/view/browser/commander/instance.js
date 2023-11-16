import*as Utils from"../../../utils.js";import*as Entity from"../../entity.js";import*as Allow_Errors from"./allow_errors.js";import*as Font_Selector from"./font_selector.js";import*as Previous from"./previous.js";import*as Selector from"./selector.js";import*as Next from"./next.js";var Child_Index;!function(e){e[e.ALLOW_ERRORS=0]="ALLOW_ERRORS",e[e.FONT_SELECTOR=1]="FONT_SELECTOR",e[e.PREVIOUS=2]="PREVIOUS",e[e.SELECTOR=3]="SELECTOR",e[e.NEXT=4]="NEXT"}(Child_Index||(Child_Index={}));export class Instance extends Entity.Instance{constructor({model:e,browser:n}){super({element:"div",parent:n,event_grid:n.Event_Grid()}),this.model=e,this.Live()}On_Life(){return this.Add_This_CSS("\n                .Commander {\n                    display: flex;\n                    flex-direction: column;\n                    justify-content: space-around;\n                    justify-items: center;\n                    align-content: space-around;\n                    align-items: center;\n\n                    padding: 4px;\n\n                    border-color: white;\n                    border-style: solid;\n                    border-width: 0 1px 0 0;\n\n                    -webkit-user-select: none;\n                    -moz-user-select: none;\n                    -ms-user-select: none;\n                    user-select: none;\n                }\n            "),this.Add_Children_CSS("\n                .Commander_Allow_Errors {\n                    width: 100%;\n\n                    text-align: center;\n\n                    cursor: pointer;\n                }\n                \n                .Commander_Font_Selector {\n                    width: 100%;\n\n                    text-align: center;\n\n                    cursor: pointer;\n                }\n\n                .Commander_Previous {\n                    width: 100%;\n\n                    text-align: center;\n\n                    cursor: pointer;\n                }\n\n                .Commander_Selector {\n                    width: 100%;\n\n                    text-align: center;\n\n                    cursor: pointer;\n                }\n\n                .Commander_Next {\n                    width: 100%;\n\n                    text-align: center;\n\n                    cursor: pointer;\n                }\n            "),[]}On_Refresh(){this.Has_Allow_Errors()&&this.Has_Font_Selector()&&this.Has_Previous()&&this.Has_Selector()&&this.Has_Next()||(this.Abort_All_Children(),new Allow_Errors.Instance({model:()=>this.Model().Allow_Errors(),commander:this}),new Font_Selector.Instance({model:()=>this.Model().Font_Selector(),commander:this}),new Previous.Instance({model:()=>this.Model().Previous(),commander:this}),new Selector.Instance({model:()=>this.Model().Selector(),commander:this}),new Next.Instance({model:()=>this.Model().Next(),commander:this}))}On_Reclass(){return["Commander"]}Model(){return this.model()}Browser(){return this.Parent()}Has_Allow_Errors(){return this.Has_Child(Child_Index.ALLOW_ERRORS)&&this.Child(Child_Index.ALLOW_ERRORS)instanceof Allow_Errors.Instance}Allow_Errors(){return 0,this.Child(Child_Index.ALLOW_ERRORS)}Has_Font_Selector(){return this.Has_Child(Child_Index.FONT_SELECTOR)&&this.Child(Child_Index.FONT_SELECTOR)instanceof Font_Selector.Instance}Allow_Font_Selector(){return 0,this.Child(Child_Index.FONT_SELECTOR)}Has_Previous(){return this.Has_Child(Child_Index.PREVIOUS)&&this.Child(Child_Index.PREVIOUS)instanceof Previous.Instance}Previous(){return 0,this.Child(Child_Index.PREVIOUS)}Has_Selector(){return this.Has_Child(Child_Index.SELECTOR)&&this.Child(Child_Index.SELECTOR)instanceof Selector.Instance}Selector(){return 0,this.Child(Child_Index.SELECTOR)}Has_Next(){return this.Has_Child(Child_Index.NEXT)&&this.Child(Child_Index.NEXT)instanceof Next.Instance}Next(){return 0,this.Child(Child_Index.NEXT)}}