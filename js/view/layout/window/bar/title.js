var __awaiter=this&&this.__awaiter||function(e,t,n,i){return new(n||(n=Promise))((function(r,s){function o(e){try{a(i.next(e))}catch(e){s(e)}}function _(e){try{a(i.throw(e))}catch(e){s(e)}}function a(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(o,_)}a((i=i.apply(e,t||[])).next())}))};import*as Event from"../../../../event.js";import*as Events from"../../../events.js";import*as Entity from"../../../entity.js";export class Instance extends Entity.Instance{constructor({model:e,bar:t}){super({element:"div",parent:t,event_grid:t.Event_Grid()}),this.model=e,this.Live()}On_Life(){return[new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.ON,Events.WINDOW_REFRESH_TITLE,this.Bar().Window().View().ID()),event_handler:this.On_Window_Refresh_Title,event_priority:0}),new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.AFTER,Events.SELECTOR_SLOT_ITEM_SELECT,this.Bar().Window().View().ID()),event_handler:this.After_Selector_Slot_Item_Select,event_priority:0})]}On_Refresh(){this.Element().textContent=this.Model().Value()}On_Reclass(){return["Title"]}On_Window_Refresh_Title(){return __awaiter(this,void 0,void 0,(function*(){this.Refresh(),yield this.Send(new Event.Info({affix:Events.WINDOW_REFRESH_TAB,suffixes:[this.Bar().Window().ID()],type:Event.Type.EXCLUSIVE,data:{}}))}))}After_Selector_Slot_Item_Select(){return __awaiter(this,void 0,void 0,(function*(){this.Refresh()}))}Model(){return this.model()}Bar(){return this.Parent()}}