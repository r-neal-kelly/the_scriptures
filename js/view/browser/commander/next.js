var __awaiter=this&&this.__awaiter||function(e,t,n,i){return new(n||(n=Promise))((function(r,o){function s(e){try{d(i.next(e))}catch(e){o(e)}}function a(e){try{d(i.throw(e))}catch(e){o(e)}}function d(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,a)}d((i=i.apply(e,t||[])).next())}))};import*as Event from"../../../event.js";import*as Events from"../../events.js";import*as Entity from"../../entity.js";export class Instance extends Entity.Instance{constructor({model:e,commander:t}){super({element:"div",parent:t,event_grid:t.Event_Grid()}),this.model=e,this.Live()}On_Life(){return this.Element().addEventListener("click",this.On_Click.bind(this)),[new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.ON,Events.BROWSER_COMMANDER_NEXT,this.Commander().Browser().Event_Grid_Hook()),event_handler:this.On,event_priority:0})]}On_Refresh(){this.Element().textContent=this.Model().Symbol()}On_Reclass(){return["Commander_Next"]}On_Click(e){return __awaiter(this,void 0,void 0,(function*(){this.Model().Can_Activate()&&(yield this.Send(new Event.Info({affix:Events.BROWSER_COMMANDER_NEXT,suffixes:[this.Commander().Browser().Event_Grid_Hook()],type:Event.Type.EXCLUSIVE,data:{}})))}))}On(){return __awaiter(this,void 0,void 0,(function*(){yield Promise.all([this.Commander().Animate_Button(this),this.Model().Activate()])}))}Model(){return this.model()}Commander(){return this.Parent()}}