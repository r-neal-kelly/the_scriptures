import*as Language from"../../../model/language.js";import*as Entity from"../../entity.js";export class Instance extends Entity.Instance{constructor({column:e,model:t}){super({element:"div",parent:e,event_grid:e.Event_Grid()}),this.model=t}On_Refresh(){const e=this.Model(),t=this.Child_Count();if(t>0&&e.Is_Blank())this.Skip_Children(),this.Element().classList.contains("Blank")&&this.Skip_Remaining_Siblings();else{const n=Math.max(e.Segment_Buffer_Count(),e.Segment_Count());if(t<n)for(let e=t,s=n;e<s;e+=1)this.Add_Segment(e);else if(t>n)for(let e=t,s=n;e>s;)e-=1,this.Abort_Child(this.Child(e))}}On_Reclass(){const e=this.Model(),t=[];return t.push("Row"),e.Is_Blank()?t.push("Blank"):e.Is_Transparent()?t.push("Transparent_Row"):e.Is_Centered()?t.push("Centered_Row"):e.Is_Padded()&&t.push("Padded_Row"),t}On_Restyle(){const e=this.Model();if(e.Is_Blank())return"";if(e.Is_Padded()){const t=`${this.Buffer().Pad_EM(e.Padding_Count())}em`,n=e.Padding_Direction()===Language.Direction.LEFT_TO_RIGHT?"left":"right";return`\n                    margin-${n}: ${t};\n                    border-${n}-width: 1px;\n                `}return""}Model(){return this.model()}Buffer(){return this.Column().Buffer()}Column(){return this.Parent()}}