import*as Model from"../../../model/buffer/search/line.js";import*as Entity from"../../entity.js";import*as Segment from"./segment.js";export class Instance extends Entity.Instance{constructor({text:e,model:t}){super({element:"div",parent:e,event_grid:e.Event_Grid()}),this.model=t,this.Live()}On_Refresh(){const e=this.Model(),t=Math.max(Model.Instance.Min_Segment_Count(),e.Segment_Count());for(let e=this.Child_Count(),n=t;e<n;e+=1)new Segment.Instance({line:this,model:()=>this.Model().Segment_At(e)})}On_Reclass(){const e=this.Model(),t=[];return t.push("Line"),e.Is_Blank()?t.push("Blank"):""===e.Value()?t.push("Transparent"):e.Is_Centered()?t.push("Centered_Line"):e.Is_Padded()&&t.push("Padded_Line"),t}On_Restyle(){return this.Model().Styles()}Model(){return this.model()}Text(){return this.Parent()}Event_Grid_ID(){return this.Text().Event_Grid_ID()}}