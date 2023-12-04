import*as Language from"../../../model/language.js";import*as Entity from"../../entity.js";export class Instance extends Entity.Instance{constructor({buffer:n,model:e,index:t}){super({element:"div",parent:n,event_grid:n.Event_Grid()}),this.model=e,this.index=t}On_Refresh(){const n=this.Model(),e=this.Child_Count();if(e>0&&n.Is_Blank())this.Skip_Children(),this.Element().classList.contains("Blank")&&this.Skip_Remaining_Siblings();else{for(let t=e,i=Math.max(n.Min_Column_Count({line_index:this.Index()}),n.Column_Count());t<i;t+=1)this.Add_Column(t)}}On_Reclass(){const n=this.Model(),e=[];return e.push("Line"),n.Is_Blank()?e.push("Blank"):n.Has_Margin()?e.push("Marginal_Line"):n.Has_Interlineation()?(e.push("Interlinear_Line"),n.Has_Forward_Interlineation()?e.push("Forward_Interlinear_Line"):e.push("Reverse_Interlinear_Line"),n.Is_Centered()?e.push("Centered_Interlinear_Line"):n.Is_Padded()&&e.push("Padded_Interlinear_Line")):n.Is_Row_Of_Table()&&(e.push("Tabular_Line"),n.Is_First_Row_Of_Table()&&e.push("First_Tabular_Line")),e}On_Restyle(){const n=this.Model();if(n.Is_Blank())return"";if(n.Has_Interlineation()){if(n.Is_Padded()){const e=`${this.Buffer().Pad_EM(n.Padding_Count())}em`,t=n.Padding_Direction()===Language.Direction.LEFT_TO_RIGHT?"left":"right";return`\n                        margin-${t}: ${e};\n                        border-${t}-width: 1px;\n                    `}return""}{const e=n.Text(),t=e.Column_Count();let i="",r="";if(n.Is_Row_Of_Table())i=n.Column_Percents().map((n=>`${n}fr`)).join(" "),r=10*t+"em";else{for(let n=0,r=t;n<r;n+=1){e.Column(n).Is_Marginal()?i+=" 0.5fr":i+=" 1fr"}r="100%"}return`\n                    grid-template-columns: ${i};\n    \n                    max-width: ${r};\n                `}}Model(){return this.model()}Index(){return this.index}Buffer(){return this.Parent()}}