var __awaiter=this&&this.__awaiter||function(e,t,n,i){return new(n||(n=Promise))((function(r,o){function s(e){try{_(i.next(e))}catch(e){o(e)}}function a(e){try{_(i.throw(e))}catch(e){o(e)}}function _(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,a)}_((i=i.apply(e,t||[])).next())}))};import*as Event from"../../../event.js";import*as Events from"../../events.js";import*as Entity from"../../entity.js";export class Instance extends Entity.Instance{constructor({model:e,commander:t}){super({element:"div",parent:t,event_grid:t.Event_Grid()}),this.model=e,this.Live()}On_Life(){return this.Element().addEventListener("click",this.On_Click.bind(this)),[new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.ON,Events.TOGGLE_ALLOW_ERRORS,this.ID()),event_handler:this.On_Toggle_Allow_Errors,event_priority:0})]}On_Refresh(){this.Element().textContent=this.Model().Symbol()}On_Reclass(){return["Commander_Allow_Errors"]}On_Click(e){return __awaiter(this,void 0,void 0,(function*(){yield this.Send(new Event.Info({affix:Events.TOGGLE_ALLOW_ERRORS,suffixes:[this.ID(),this.Commander().Browser().ID()],type:Event.Type.EXCLUSIVE,data:{}}))}))}On_Toggle_Allow_Errors(){return __awaiter(this,void 0,void 0,(function*(){yield this.Model().Toggle()}))}Model(){return this.model()}Commander(){return this.Parent()}}