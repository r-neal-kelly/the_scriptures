var __awaiter=this&&this.__awaiter||function(t,e,n,i){return new(n||(n=Promise))((function(s,o){function r(t){try{d(i.next(t))}catch(t){o(t)}}function a(t){try{d(i.throw(t))}catch(t){o(t)}}function d(t){var e;t.done?s(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(r,a)}d((i=i.apply(t,e||[])).next())}))};import*as Event from"../../../../event.js";import*as Events from"../../../events.js";import*as Entity from"../../../entity.js";export class Instance extends Entity.Instance{constructor({model:t,commands:e}){super({element:"div",parent:e,event_grid:e.Event_Grid()}),this.model=t,this.Live()}On_Life(){return this.Element().addEventListener("click",this.On_Click.bind(this)),[new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.ON,Events.WINDOW_CLOSE,this.ID()),event_handler:this.On_Window_Close,event_priority:0})]}On_Refresh(){this.Element().textContent=this.Model().Symbol()}On_Reclass(){return["Button"]}On_Click(t){return __awaiter(this,void 0,void 0,(function*(){yield this.Send(new Event.Info({affix:Events.WINDOW_CLOSE,suffixes:[this.ID(),this.Commands().Bar().Window().Wall().Layout().ID()],type:Event.Type.EXCLUSIVE,data:{}}))}))}On_Window_Close(){return __awaiter(this,void 0,void 0,(function*(){yield this.Model().Click()}))}Model(){return this.model()}Commands(){return this.Parent()}}