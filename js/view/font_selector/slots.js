import*as Entity from"../entity.js";import*as Slot from"./slot.js";export class Instance extends Entity.Instance{constructor({selector:t,model:e}){super({element:"div",parent:t,event_grid:t.Event_Grid()}),this.model=e,this.Live()}On_Refresh(){if(this.Is_Visible()){const t=this.Model().Slot_Count(),e=this.Child_Count(),s=t-e;if(s<0)for(let t=e,i=e+s;t>i;)t-=1,this.Abort_Child(this.Child(t));else if(s>0)for(let t=e,i=e+s;t<i;t+=1)new Slot.Instance({slots:this,model:()=>this.Model().Slot_At_Index(t)})}else this.Skip_Children()}On_Reclass(){const t=[];return t.push("Slots"),this.Is_Visible()||t.push("Invisible"),t}Model(){return this.model()}Is_Visible(){return this.Selector().Is_Visible()}Selector(){return this.Parent()}}