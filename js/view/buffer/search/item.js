import*as Model from"../../../model/buffer/search/item.js";import*as Entity from"../../entity.js";import*as Division from"./division.js";export class Instance extends Entity.Instance{constructor({segment:e,model:t}){super({element:"div",parent:e,event_grid:e.Event_Grid()}),this.model=t,this.Live()}On_Refresh(){const e=this.Model();if(e.Is_Blank())this.Skip_Children(),this.Element().classList.contains("Blank")&&this.Skip_Remaining_Siblings();else{const t=Math.max(Model.Instance.Min_Division_Count(),e.Division_Count());for(let e=this.Child_Count(),s=t;e<s;e+=1)new Division.Instance({item:this,model:()=>this.Model().Division_At(e)})}}On_Reclass(){const e=this.Model(),t=[];return t.push("Item"),e.Is_Blank()?t.push("Blank"):(e.Is_Indented()&&t.push("Indented_Item"),e.Has_Italic_Style()&&t.push("Italic"),e.Has_Bold_Style()&&t.push("Bold"),e.Has_Underline_Style()&&t.push("Underline"),e.Has_Small_Caps_Style()&&t.push("Small_Caps"),(e.Is_Error()||e.Has_Error_Style())&&t.push("Error")),t}Model(){return this.model()}Segment(){return this.Parent()}Event_Grid_ID(){return this.Segment().Event_Grid_ID()}}