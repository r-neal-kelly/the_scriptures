import*as Model from"../../../model/buffer/search/segment.js";import*as Entity from"../../entity.js";import*as Item from"./item.js";export class Instance extends Entity.Instance{constructor({line:t,model:e}){super({element:"div",parent:t,event_grid:t.Event_Grid()}),this.model=e,this.Live()}On_Refresh(){const t=this.Model();if(t.Is_Blank())this.Skip_Children(),this.Element().classList.contains("Blank")&&this.Skip_Remaining_Siblings();else{const e=Math.max(Model.Instance.Min_Item_Count(),t.Item_Count());for(let t=this.Child_Count(),n=e;t<n;t+=1)new Item.Instance({segment:this,model:()=>this.Model().Item_At(t)})}}On_Reclass(){const t=this.Model(),e=[];return e.push("Segment"),t.Is_Blank()?e.push("Blank"):t.Has_Left_To_Right_Style()?e.push("Left_To_Right"):t.Has_Right_To_Left_Style()&&e.push("Right_To_Left"),e}Model(){return this.model()}Line(){return this.Parent()}Event_Grid_ID(){return this.Line().Event_Grid_ID()}}