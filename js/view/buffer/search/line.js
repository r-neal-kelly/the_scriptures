import*as Model from"../../../model/buffer/search/line.js";import*as Entity from"../../entity.js";import*as Column from"./column.js";export class Instance extends Entity.Instance{constructor({search:e,model:t}){super({element:"div",parent:e,event_grid:e.Event_Grid()}),this.model=t,this.Live()}On_Refresh(){const e=this.Model(),t=Math.max(Model.Instance.Min_Column_Count(),e.Column_Count());for(let e=this.Child_Count(),n=t;e<n;e+=1)new Column.Instance({line:this,model:()=>this.Model().Column_At(e)})}On_Reclass(){const e=this.Model(),t=[];return t.push("Line"),e.Is_Blank()&&t.push("Blank"),t}On_Restyle(){return this.Model().Styles()}Model(){return this.model()}Search(){return this.Parent()}Event_Grid_ID(){return this.Search().Event_Grid_ID()}}