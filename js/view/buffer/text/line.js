import*as Model from"../../../model/buffer/text/line.js";import*as Entity from"../../entity.js";import*as Column from"./column.js";export class Instance extends Entity.Instance{constructor({text:e,model:n}){super({element:"div",parent:e,event_grid:e.Event_Grid()}),this.model=n,this.Live()}On_Refresh(){const e=this.Model(),n=Math.max(Model.Instance.Min_Column_Count(),e.Column_Count());for(let e=this.Child_Count(),t=n;e<t;e+=1)new Column.Instance({line:this,model:()=>this.Model().Column_At(e)})}On_Reclass(){const e=this.Model(),n=[];return n.push("Line"),e.Is_Blank()?n.push("Blank"):e.Has_Margin()?n.push("Marginal_Line"):e.Has_Interlineation()?(n.push("Interlinear_Line"),e.Has_Forward_Interlineation()?n.push("Forward_Interlinear_Line"):n.push("Reverse_Interlinear_Line")):e.Is_Row_Of_Table()&&(n.push("Tabular_Line"),e.Is_First_Row_Of_Table()&&n.push("First_Tabular_Line")),n}On_Restyle(){return this.Model().Styles()}Model(){return this.model()}Text(){return this.Parent()}Event_Grid_ID(){return this.Text().Event_Grid_ID()}}