var __awaiter=this&&this.__awaiter||function(e,t,n,i){return new(n||(n=Promise))((function(s,r){function o(e){try{a(i.next(e))}catch(e){r(e)}}function E(e){try{a(i.throw(e))}catch(e){r(e)}}function a(e){var t;e.done?s(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(o,E)}a((i=i.apply(e,t||[])).next())}))};import*as Event from"../../../event.js";import*as Events from"../../events.js";import*as Entity from"../../entity.js";export class Instance extends Entity.Instance{constructor({body:e,model:t}){super({element:"div",parent:e,event_grid:e.Event_Grid()}),this.model=t,this.Live()}On_Life(){return this.Element().addEventListener("keydown",this.On_Key_Down.bind(this)),this.Element().setAttribute("contentEditable","true"),this.Element().setAttribute("spellcheck","false"),[new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.ON,Events.FINDER_BODY_EXPRESSION_ENTER,this.ID()),event_handler:this.On_Finder_Body_Expression_Enter,event_priority:0})]}On_Refresh(){this.Element().textContent=this.Model().Value()}On_Reclass(){return["Expression"]}On_Key_Down(e){return __awaiter(this,void 0,void 0,(function*(){"Enter"===e.key&&(e.preventDefault(),yield this.Send(new Event.Info({affix:Events.FINDER_BODY_EXPRESSION_ENTER,suffixes:[this.ID(),this.Body().Finder().ID()],type:Event.Type.EXCLUSIVE,data:{}})))}))}On_Finder_Body_Expression_Enter(){return __awaiter(this,void 0,void 0,(function*(){this.Model().Set_Value(null!=this.Element().textContent?this.Element().textContent:"")}))}Model(){return this.model()}Body(){return this.Parent()}}