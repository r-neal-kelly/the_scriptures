import*as Entity from"../../entity.js";export class Instance extends Entity.Instance{constructor({slot:t,model:e}){super({element:"div",parent:t,event_grid:t.Event_Grid()}),this.model=e,this.Live()}On_Refresh(){const t=this.Model();this.Element().textContent=t.Name()}On_Reclass(){return["Slot_Title"]}Model(){return this.model()}Is_Visible(){return this.Slot().Is_Visible()}Slot(){return this.Parent()}}