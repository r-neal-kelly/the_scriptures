var Child_Index,__awaiter=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(i,o){function s(e){try{l(r.next(e))}catch(e){o(e)}}function _(e){try{l(r.throw(e))}catch(e){o(e)}}function l(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,_)}l((r=r.apply(e,t||[])).next())}))};import*as Utils from"../../../utils.js";import*as Event from"../../../event.js";import*as Events from"../../events.js";import*as Entity from"../../entity.js";import*as Font_Selector from"../../font_selector.js";import*as Selector from"../../selector.js";import*as Reader from"./reader.js";!function(e){e[e.FONT_SELECTOR=0]="FONT_SELECTOR",e[e.SELECTOR=1]="SELECTOR",e[e.READER=2]="READER"}(Child_Index||(Child_Index={}));export class Instance extends Entity.Instance{constructor({model:e,browser:t}){super({element:"div",parent:t,event_grid:t.Event_Grid()}),this.model=e,this.Live()}On_Life(){return[new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.AFTER,Events.SELECTOR_TOGGLE,this.Browser().ID()),event_handler:this.After_Selector_Toggle,event_priority:0}),new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.AFTER,Events.FONT_SELECTOR_TOGGLE,this.Browser().ID()),event_handler:this.After_Font_Selector_Toggle,event_priority:0}),new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.ON,Events.SELECTOR_SLOT_ITEM_SELECT,this.Browser().ID()),event_handler:this.On_Selector_Slot_Item_Select,event_priority:10}),new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.ON,Events.FONT_SELECTOR_SLOT_ITEM_SELECT,this.Browser().ID()),event_handler:this.On_Font_Selector_Slot_Item_Select,event_priority:10}),new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.ON,Events.BROWSER_COMMANDER_PREVIOUS,this.Browser().ID()),event_handler:this.On_Browser_Commander_Previous,event_priority:10}),new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.ON,Events.BROWSER_COMMANDER_NEXT,this.Browser().ID()),event_handler:this.On_Browser_Commander_Next,event_priority:10}),new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.ON,Events.TOGGLE_ALLOW_ERRORS,this.Browser().ID()),event_handler:this.On_Toggle_Allow_Errors,event_priority:10})]}On_Refresh(){this.Has_Font_Selector()&&this.Has_Selector()&&this.Has_Reader()||(this.Abort_All_Children(),new Font_Selector.Instance({parent:this,model:()=>this.Model().Font_Selector(),event_grid_hook:()=>this.Browser().ID(),is_visible:()=>this.Model().Browser().Commander().Font_Selector().Is_Activated()}),new Selector.Instance({parent:this,model:()=>this.Model().Selector(),event_grid_hook:()=>this.Browser().ID(),is_visible:()=>this.Model().Browser().Commander().Selector().Is_Activated()}),new Reader.Instance({body:this,model:()=>this.Model().Reader()}))}On_Reclass(){return["Body"]}After_Selector_Toggle(){return __awaiter(this,void 0,void 0,(function*(){this.Selector().Refresh(),this.Font_Selector().Refresh()}))}After_Font_Selector_Toggle(){return __awaiter(this,void 0,void 0,(function*(){this.Selector().Refresh(),this.Font_Selector().Refresh()}))}On_Selector_Slot_Item_Select(){return __awaiter(this,void 0,void 0,(function*(){yield this.Model().Reader().Refresh_File()}))}On_Font_Selector_Slot_Item_Select({should_update_text:e}){return __awaiter(this,void 0,void 0,(function*(){e&&(yield this.Model().Reader().Refresh_File(!0))}))}On_Browser_Commander_Previous(){return __awaiter(this,void 0,void 0,(function*(){yield this.Model().Reader().Refresh_File()}))}On_Browser_Commander_Next(){return __awaiter(this,void 0,void 0,(function*(){yield this.Model().Reader().Refresh_File()}))}On_Toggle_Allow_Errors(){return __awaiter(this,void 0,void 0,(function*(){yield this.Model().Reader().Refresh_File()}))}Model(){return this.model()}Browser(){return this.Parent()}Has_Font_Selector(){return this.Has_Child(Child_Index.FONT_SELECTOR)&&this.Child(Child_Index.FONT_SELECTOR)instanceof Font_Selector.Instance}Font_Selector(){return 0,this.Child(Child_Index.FONT_SELECTOR)}Has_Selector(){return this.Has_Child(Child_Index.SELECTOR)&&this.Child(Child_Index.SELECTOR)instanceof Selector.Instance}Selector(){return 0,this.Child(Child_Index.SELECTOR)}Has_Reader(){return this.Has_Child(Child_Index.READER)&&this.Child(Child_Index.READER)instanceof Reader.Instance}Reader(){return 0,this.Child(Child_Index.READER)}}