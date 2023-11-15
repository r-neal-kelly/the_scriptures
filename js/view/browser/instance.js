var __awaiter=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(i,o){function s(e){try{a(r.next(e))}catch(e){o(e)}}function _(e){try{a(r.throw(e))}catch(e){o(e)}}function a(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,_)}a((r=r.apply(e,t||[])).next())}))};import*as Utils from"../../utils.js";import*as Event from"../../event.js";import*as Events from"../events.js";import*as Entity from"../entity.js";import*as Commander from"./commander.js";import*as Body from"./body.js";export class Instance extends Entity.Instance{constructor({model:e,root:t}){super({element:"div",parent:t,event_grid:t.Event_Grid()}),this.model=e,this.Live()}On_Life(){return this.Add_This_CSS("\n                .Browser {\n                    display: grid;\n                    grid-template-rows: 1fr;\n                    grid-template-columns: auto 1fr;\n                    justify-content: start;\n\n                    width: 100%;\n                    height: 100%;\n\n                    overflow-x: hidden;\n                    overflow-y: hidden;\n\n                    color: white;\n                }\n            "),this.Add_Children_CSS("\n                .Body {\n                    display: grid;\n                    grid-template-rows: 1fr;\n                    grid-template-columns: 1fr;\n                    justify-content: start;\n\n                    position: relative;\n\n                    width: 100%;\n                    height: 100%;\n\n                    overflow-x: hidden;\n                    overflow-y: hidden;\n                }\n\n                .Reader {\n                    z-index: 0;\n\n                    width: 100%;\n\n                    overflow-x: auto;\n                    overflow-y: auto;\n                }\n\n                .Hidden {\n                    display: none;\n                }\n            "),[new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.AFTER,Events.BROWSER_COMMANDER_PREVIOUS,this.ID()),event_handler:this.After_Browser_Commander_Previous,event_priority:0}),new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.AFTER,Events.BROWSER_COMMANDER_NEXT,this.ID()),event_handler:this.After_Browser_Commander_Next,event_priority:0}),new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.AFTER,Events.SELECTOR_TOGGLE,this.ID()),event_handler:this.After_Selector_Toggle,event_priority:0}),new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.AFTER,Events.SELECTOR_SLOT_ITEM_SELECT,this.ID()),event_handler:this.After_Selector_Slot_Item_Select,event_priority:0}),new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.AFTER,Events.FONT_SELECTOR_TOGGLE,this.ID()),event_handler:this.After_Font_Selector_Toggle,event_priority:0}),new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.AFTER,Events.FONT_SELECTOR_SLOT_ITEM_SELECT,this.ID()),event_handler:this.After_Font_Selector_Slot_Item_Select,event_priority:0}),new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.AFTER,Events.TOGGLE_ALLOW_ERRORS,this.ID()),event_handler:this.After_Toggle_Allow_Errors,event_priority:0})]}On_Refresh(){this.Has_Commander()&&this.Has_Body()||(this.Abort_All_Children(),new Commander.Instance({model:()=>this.Model().Commander(),browser:this}),new Body.Instance({model:()=>this.Model().Body(),browser:this}))}On_Reclass(){return["Browser"]}After_Browser_Commander_Previous(){return __awaiter(this,void 0,void 0,(function*(){this.Refresh()}))}After_Browser_Commander_Next(){return __awaiter(this,void 0,void 0,(function*(){this.Refresh()}))}After_Selector_Toggle(){return __awaiter(this,void 0,void 0,(function*(){this.Refresh()}))}After_Selector_Slot_Item_Select(){return __awaiter(this,void 0,void 0,(function*(){this.Refresh()}))}After_Font_Selector_Toggle(){return __awaiter(this,void 0,void 0,(function*(){this.Refresh()}))}After_Font_Selector_Slot_Item_Select(){return __awaiter(this,void 0,void 0,(function*(){this.Refresh()}))}After_Toggle_Allow_Errors(){return __awaiter(this,void 0,void 0,(function*(){this.Refresh()}))}Model(){return this.model()}Root(){return this.Parent()}Has_Commander(){return this.Has_Child(0)&&this.Child(0)instanceof Commander.Instance}Commander(){return  this.Child(0)}Has_Body(){return this.Has_Child(1)&&this.Child(1)instanceof Body.Instance}Body(){return  this.Child(1)}}