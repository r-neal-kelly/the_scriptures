var __awaiter=this&&this.__awaiter||function(e,t,n,i){return new(n||(n=Promise))((function(o,s){function r(e){try{l(i.next(e))}catch(e){s(e)}}function _(e){try{l(i.throw(e))}catch(e){s(e)}}function l(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(r,_)}l((i=i.apply(e,t||[])).next())}))};import*as Event from"../../../event.js";import*as Events from"../../events.js";import*as Entity from"../../entity.js";export class Instance extends Entity.Instance{constructor({items:e,model:t}){super({element:"div",parent:e,event_grid:e.Event_Grid()}),this.model=t,this.Live()}On_Life(){return this.Element().addEventListener("click",this.On_Click.bind(this)),[new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.ON,Events.SELECTOR_SLOT_ITEM_HIGHLIGHT,this.ID()),event_handler:this.On_Selector_Slot_Item_Highlight,event_priority:0}),new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.ON,Events.SELECTOR_SLOT_ITEM_UNHIGHLIGHT,this.ID()),event_handler:this.On_Selector_Slot_Item_Unhighlight,event_priority:0}),new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.ON,Events.SELECTOR_SLOT_ITEM_SELECT,this.ID()),event_handler:this.On_Selector_Slot_Item_Select,event_priority:0})]}On_Refresh(){this.Element().textContent=this.Model().Name()}On_Reclass(){const e=this.Model(),t=[];return t.push("Slot_Item"),e.Is_Selected()&&t.push("Slot_Item_Selected"),t}On_Restyle(){return""}On_Click(e){return __awaiter(this,void 0,void 0,(function*(){yield this.Send(new Event.Info({affix:Events.SELECTOR_SLOT_ITEM_SELECT,suffixes:[this.ID(),this.Items().ID(),this.Items().Slot().ID(),this.Items().Slot().Slots().ID(),this.Items().Slot().Slots().Selector().ID(),this.Items().Slot().Slots().Selector().Event_Grid_Hook()],type:Event.Type.EXCLUSIVE,data:{}}))}))}On_Selector_Slot_Item_Highlight(){return __awaiter(this,void 0,void 0,(function*(){yield this.Animate([{offset:0,backgroundColor:"black",color:"white"},{offset:1,backgroundColor:"white",color:"black"}],{duration:200,easing:"ease",fill:"both"})}))}On_Selector_Slot_Item_Unhighlight(){return __awaiter(this,void 0,void 0,(function*(){yield this.Animate([{offset:0,backgroundColor:"white",color:"black"},{offset:1,backgroundColor:"black",color:"white"}],{duration:200,easing:"ease",fill:"both"})}))}On_Selector_Slot_Item_Select(){return __awaiter(this,void 0,void 0,(function*(){const e=this.Model(),t=[];if(e.Slot().Has_Selected_Item()){const n=this.Parent().Child(e.Slot().Selected_Item_Index()).ID();t.push(this.Send(new Event.Info({affix:Events.SELECTOR_SLOT_ITEM_UNHIGHLIGHT,suffixes:[n],type:Event.Type.EXCLUSIVE,data:{}})))}t.push(this.Send(new Event.Info({affix:Events.SELECTOR_SLOT_ITEM_HIGHLIGHT,suffixes:[this.ID()],type:Event.Type.EXCLUSIVE,data:{}}))),yield Promise.all(t),this.Model().Select()}))}Model(){return this.model()}Items(){return this.Parent()}Is_Visible(){return this.Items().Is_Visible()}}