import*as Entity from"../../../../entity.js";import*as Item from"./item.js";export class Instance extends Entity.Instance{constructor({model:t,slot:e}){super({element:"div",parent:e,event_grid:e.Event_Grid()}),this.model=t}On_Refresh(){const t=this.Model().Count(),e=this.Child_Count(),s=t-e;if(s<0)for(let t=e,n=e+s;t>n;)t-=1,this.Abort_Child(this.Child(t));else if(s>0)for(let t=e,n=e+s;t<n;t+=1)new Item.Instance({model:()=>this.Model().At(t),items:this})}On_Reclass(){return["Slot_Items"]}Model(){return this.model()}Slot(){return this.Parent()}}