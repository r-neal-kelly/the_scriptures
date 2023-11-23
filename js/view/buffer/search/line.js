import*as Model from"../../../model/buffer/search/line.js";import*as Entity from"../../entity.js";import*as Column from"./column.js";export class Instance extends Entity.Instance{constructor({search:e,model:n}){super({element:"div",parent:e,event_grid:e.Event_Grid()}),this.model=n,this.Live()}On_Refresh(){const e=this.Model(),n=Math.max(Model.Instance.Min_Column_Count(),e.Column_Count());for(let e=this.Child_Count(),t=n;e<t;e+=1)new Column.Instance({line:this,model:()=>this.Model().Column_At(e)})}On_Reclass(){const e=this.Model(),n=[];return n.push("Line"),n.push("Search_Line"),e.Is_Blank()?n.push("Blank"):e.Has_Margin()?n.push("Marginal_Line"):e.Has_Interlineation()?(n.push("Interlinear_Line"),e.Has_Forward_Interlineation()?n.push("Forward_Interlinear_Line"):n.push("Reverse_Interlinear_Line"),e.Is_Centered()?n.push("Centered_Interlinear_Line"):e.Is_Padded()&&n.push("Padded_Interlinear_Line")):e.Is_Row_Of_Table()&&(n.push("Tabular_Line"),e.Is_First_Row_Of_Table()&&n.push("First_Tabular_Line")),n}On_Restyle(){return this.Model().Styles()}Model(){return this.model()}Search(){return this.Parent()}Event_Grid_ID(){return this.Search().Event_Grid_ID()}}