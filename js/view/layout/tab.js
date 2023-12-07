var __awaiter=this&&this.__awaiter||function(e,t,n,i){return new(n||(n=Promise))((function(s,r){function o(e){try{_(i.next(e))}catch(e){r(e)}}function a(e){try{_(i.throw(e))}catch(e){r(e)}}function _(e){var t;e.done?s(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(o,a)}_((i=i.apply(e,t||[])).next())}))};import*as Event from"../../event.js";import*as Events from"../events.js";import*as Entity from"../entity.js";export class Instance extends Entity.Instance{constructor({model:e,tabs:t}){super({element:"div",parent:t,event_grid:t.Event_Grid()}),this.model=e,this.Live()}On_Life(){return this.Element().addEventListener("click",this.On_Click.bind(this)),[new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.AFTER,Events.WINDOW_ACTIVATE,this.Window().Wall().ID()),event_handler:this.After_Window_Activate,event_priority:0}),new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.AFTER,Events.WINDOW_DEACTIVATE,this.Window().Wall().ID()),event_handler:this.After_Window_Deactivate,event_priority:0}),new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.AFTER,Events.WINDOW_REFRESH_TITLE,this.Window().ID()),event_handler:this.After_Window_Refresh_Title,event_priority:0})]}On_Refresh(){this.Element().textContent=this.Model().Title()}On_Reclass(){const e=this.Model(),t=[];return t.push("Tab"),e.Window().Is_Active()&&t.push("Active_Tab"),t}On_Click(){return __awaiter(this,void 0,void 0,(function*(){this.Model().Window().Is_Minimized()&&(yield this.Send(new Event.Info({affix:Events.WINDOW_TOGGLE_MINIMIZATION,suffixes:[this.Window().ID(),this.Window().Wall().ID(),this.Window().Wall().Layout().ID()],type:Event.Type.EXCLUSIVE,data:{}}))),yield this.Send(new Event.Info({affix:Events.WINDOW_ACTIVATE,suffixes:[this.Window().ID(),this.Window().Wall().ID(),this.Window().Wall().Layout().ID()],type:Event.Type.EXCLUSIVE,data:{}}))}))}After_Window_Activate(){return __awaiter(this,void 0,void 0,(function*(){this.Refresh()}))}After_Window_Deactivate(){return __awaiter(this,void 0,void 0,(function*(){this.Refresh()}))}After_Window_Refresh_Title(){return __awaiter(this,void 0,void 0,(function*(){this.Refresh()}))}Model(){return this.model()}Tabs(){return this.Parent()}Window(){return this.Tabs().Taskbar().Layout().Wall().Window_With_Model(this.Model().Window())}}