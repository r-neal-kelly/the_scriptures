var Child_Index,__awaiter=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(s,o){function i(e){try{a(r.next(e))}catch(e){o(e)}}function l(e){try{a(r.throw(e))}catch(e){o(e)}}function a(e){var t;e.done?s(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,l)}a((r=r.apply(e,t||[])).next())}))};import*as Utils from"../../../utils.js";import*as Event from"../../../event.js";import*as Events from"../../events.js";import*as Entity from"../../entity.js";import*as Allow_Errors from"./allow_errors.js";import*as Font_Selector from"./font_selector.js";import*as Previous from"./previous.js";import*as Selector from"./selector.js";import*as Next from"./next.js";!function(e){e[e.ALLOW_ERRORS=0]="ALLOW_ERRORS",e[e.FONT_SELECTOR=1]="FONT_SELECTOR",e[e.PREVIOUS=2]="PREVIOUS",e[e.SELECTOR=3]="SELECTOR",e[e.NEXT=4]="NEXT"}(Child_Index||(Child_Index={}));export class Instance extends Entity.Instance{constructor({model:e,browser:t}){super({element:"div",parent:t,event_grid:t.Event_Grid()}),this.model=e,this.Live()}On_Life(){return this.Add_This_CSS("\n                .Commander {\n                    display: grid;\n                    grid-template-columns: 1fr;\n                    grid-template-rows: repeat(5, 1fr);\n        \n                    justify-items: stretch;\n                    align-items: stretch;\n                    justify-content: stretch;\n                    align-content: stretch;\n                    \n                    padding: 4px;\n\n                    border-color: white;\n                    border-style: solid;\n                    border-width: 0 1px 0 0;\n\n                    background-color: hsl(0, 0%, 0%, 0.7);\n\n                    -webkit-user-select: none;\n                    -moz-user-select: none;\n                    -ms-user-select: none;\n                    user-select: none;\n                }\n            "),this.Add_Children_CSS("\n                .Commander_Allow_Errors,\n                .Commander_Font_Selector,\n                .Commander_Previous,\n                .Commander_Selector,\n                .Commander_Next {\n                    display: grid;\n                    grid-template-columns: 1fr;\n                    grid-template-rows: 1fr;\n        \n                    justify-items: center;\n                    align-items: center;\n                    justify-content: stretch;\n                    align-content: stretch;\n\n                    width: 100%;\n\n                    text-align: center;\n\n                    cursor: pointer;\n                }\n\n                .Commander_Grey {\n                    color: grey;\n                }\n            "),[new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.AFTER,Events.SELECTOR_TOGGLE,this.ID()),event_handler:this.After_Selector_Toggle,event_priority:0}),new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.AFTER,Events.FONT_SELECTOR_TOGGLE,this.ID()),event_handler:this.After_Font_Selector_Toggle,event_priority:0})]}On_Refresh(){this.Has_Allow_Errors()&&this.Has_Font_Selector()&&this.Has_Previous()&&this.Has_Selector()&&this.Has_Next()||(this.Abort_All_Children(),new Allow_Errors.Instance({model:()=>this.Model().Allow_Errors(),commander:this}),new Font_Selector.Instance({model:()=>this.Model().Font_Selector(),commander:this}),new Previous.Instance({model:()=>this.Model().Previous(),commander:this}),new Selector.Instance({model:()=>this.Model().Selector(),commander:this}),new Next.Instance({model:()=>this.Model().Next(),commander:this}))}On_Reclass(){return["Commander"]}After_Selector_Toggle(){return __awaiter(this,void 0,void 0,(function*(){this.Refresh()}))}After_Font_Selector_Toggle(){return __awaiter(this,void 0,void 0,(function*(){this.Refresh()}))}Model(){return this.model()}Browser(){return this.Parent()}Has_Allow_Errors(){return this.Has_Child(Child_Index.ALLOW_ERRORS)&&this.Child(Child_Index.ALLOW_ERRORS)instanceof Allow_Errors.Instance}Allow_Errors(){return 0,this.Child(Child_Index.ALLOW_ERRORS)}Has_Font_Selector(){return this.Has_Child(Child_Index.FONT_SELECTOR)&&this.Child(Child_Index.FONT_SELECTOR)instanceof Font_Selector.Instance}Allow_Font_Selector(){return 0,this.Child(Child_Index.FONT_SELECTOR)}Has_Previous(){return this.Has_Child(Child_Index.PREVIOUS)&&this.Child(Child_Index.PREVIOUS)instanceof Previous.Instance}Previous(){return 0,this.Child(Child_Index.PREVIOUS)}Has_Selector(){return this.Has_Child(Child_Index.SELECTOR)&&this.Child(Child_Index.SELECTOR)instanceof Selector.Instance}Selector(){return 0,this.Child(Child_Index.SELECTOR)}Has_Next(){return this.Has_Child(Child_Index.NEXT)&&this.Child(Child_Index.NEXT)instanceof Next.Instance}Next(){return 0,this.Child(Child_Index.NEXT)}Animate_Button(e){return __awaiter(this,void 0,void 0,(function*(){yield e.Animate([{offset:0,backgroundColor:"transparent",color:"white"},{offset:.5,backgroundColor:"white",color:"black"},{offset:1,backgroundColor:"transparent",color:"white"}],{duration:200,easing:"ease"})}))}}