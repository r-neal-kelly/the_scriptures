var __awaiter=this&&this.__awaiter||function(e,t,n,i){return new(n||(n=Promise))((function(r,o){function s(e){try{_(i.next(e))}catch(e){o(e)}}function a(e){try{_(i.throw(e))}catch(e){o(e)}}function _(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,a)}_((i=i.apply(e,t||[])).next())}))};import*as Event from"../../../event.js";import*as Events from"../../events.js";import*as Entity from"../../entity.js";export class Instance extends Entity.Instance{constructor({model:e,commander:t}){super({element:"div",parent:t,event_grid:t.Event_Grid()}),this.model=e,this.Live()}On_Life(){return this.Element().addEventListener("click",this.On_Click.bind(this)),[new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.ON,Events.BROWSER_COMMANDER_PREVIOUS,this.Commander().Browser().Event_Grid_Hook()),event_handler:this.On,event_priority:0}),new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.AFTER,Events.SELECTOR_SLOT_ITEM_SELECT,this.Commander().Browser().ID()),event_handler:this.After_Selector_Slot_Item_Select,event_priority:0})]}On_Refresh(){this.Element().textContent=this.Model().Symbol()}On_Reclass(){const e=this.Model(),t=[];return t.push("Commander_Previous"),e.Can_Activate()||t.push("Commander_Grey"),t}On_Click(e){return __awaiter(this,void 0,void 0,(function*(){this.Model().Can_Activate()&&(yield this.Send(new Event.Info({affix:Events.BROWSER_COMMANDER_PREVIOUS,suffixes:[this.Commander().Browser().Event_Grid_Hook()],type:Event.Type.EXCLUSIVE,data:{}})))}))}On(){return __awaiter(this,void 0,void 0,(function*(){yield Promise.all([this.Commander().Animate_Button(this),this.Model().Activate()])}))}After_Selector_Slot_Item_Select(){return __awaiter(this,void 0,void 0,(function*(){this.Reclass()}))}Model(){return this.model()}Commander(){return this.Parent()}}