var __awaiter=this&&this.__awaiter||function(t,n,e,i){return new(e||(e=Promise))((function(o,a){function r(t){try{d(i.next(t))}catch(t){a(t)}}function s(t){try{d(i.throw(t))}catch(t){a(t)}}function d(t){var n;t.done?o(t.value):(n=t.value,n instanceof e?n:new e((function(t){t(n)}))).then(r,s)}d((i=i.apply(t,n||[])).next())}))};import*as Event from"../../../../event.js";import*as Entity from"../../../entity.js";export class Instance extends Entity.Instance{constructor({model:t,commands:n}){super({element:"div",parent:n,event_grid:n.Event_Grid()}),this.model=t}On_Life(){return this.Element().addEventListener("click",this.On_Click.bind(this)),[new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.ON,"Window_Toggle_Maximization",this.ID()),event_handler:this.On_Window_Toggle_Maximization,event_priority:0})]}On_Refresh(){this.Element().textContent=this.Model().Symbol()}On_Reclass(){return["Button"]}On_Click(t){return __awaiter(this,void 0,void 0,(function*(){yield this.Send(new Event.Info({affix:"Window_Toggle_Maximization",suffixes:[this.ID(),this.Commands().Bar().Window().Wall().Layout().ID()],type:Event.Type.EXCLUSIVE,data:{}}))}))}On_Window_Toggle_Maximization(){return __awaiter(this,void 0,void 0,(function*(){yield this.Model().Click()}))}Model(){return this.model()}Commands(){return this.Parent()}}