var __awaiter=this&&this.__awaiter||function(e,t,n,i){return new(n||(n=Promise))((function(r,s){function o(e){try{_(i.next(e))}catch(e){s(e)}}function a(e){try{_(i.throw(e))}catch(e){s(e)}}function _(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(o,a)}_((i=i.apply(e,t||[])).next())}))};import*as Event from"../../../../../event.js";import*as Events from"../../../../events.js";import*as Entity from"../../../../entity.js";import*as Tree from"./instance.js";export class Instance extends Entity.Instance{constructor({parent:e,model:t}){super({element:"div",parent:e,event_grid:e.Event_Grid()}),this.model=t,this.Live()}On_Life(){return this.Element().addEventListener("click",this.On_Click.bind(this)),[new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.ON,Events.FINDER_BODY_TREE_LEAF_SELECT,this.ID()),event_handler:this.On_Finder_Body_Tree_Leaf_Select,event_priority:0})]}On_Refresh(){this.Element().textContent=this.Model().Name()}On_Reclass(){const e=this.Model(),t=[];return t.push("Leaf"),e.Is_Selected()&&t.push("Selected"),t}On_Click(){return __awaiter(this,void 0,void 0,(function*(){yield this.Send(new Event.Info({affix:Events.FINDER_BODY_TREE_LEAF_SELECT,suffixes:[this.ID(),this.Tree().Results().Body().Finder().ID()],type:Event.Type.EXCLUSIVE,data:{}}))}))}On_Finder_Body_Tree_Leaf_Select(){return __awaiter(this,void 0,void 0,(function*(){this.Model().Select()}))}Model(){return this.model()}Tree(){let e=this.Parent();for(;!(e instanceof Tree.Instance);)e=e.Parent();return e}}