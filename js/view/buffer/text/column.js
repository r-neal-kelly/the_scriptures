import*as Model from"../../../model/buffer/text/column.js";import*as Entity from"../../entity.js";import*as Row from"./row.js";export class Instance extends Entity.Instance{constructor({line:e,model:t}){super({element:"div",parent:e,event_grid:e.Event_Grid()}),this.model=t,this.Live()}On_Refresh(){const e=this.Model(),t=Math.max(Model.Instance.Min_Row_Count(),e.Row_Count());for(let e=this.Child_Count(),n=t;e<n;e+=1)new Row.Instance({column:this,model:()=>this.Model().Row_At(e)})}On_Reclass(){const e=this.Model(),t=[];return t.push("Column"),e.Is_Blank()?t.push("Blank"):e.Is_Marginal()?t.push("Marginal_Column"):e.Is_Interlinear()&&t.push("Interlinear_Column"),t}On_Restyle(){return this.Model().Styles()}Model(){return this.model()}Line(){return this.Parent()}Event_Grid_ID(){return this.Line().Event_Grid_ID()}}