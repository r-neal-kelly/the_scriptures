import*as Model_Languages from"../../../model/languages.js";import*as Entity from"../../entity.js";export class Instance extends Entity.Instance{constructor({segment:e,model:t}){super({element:"div",parent:e,event_grid:e.Event_Grid()}),this.model=t,this.Live()}On_Refresh(){this.Element().textContent=this.Model().Value()}On_Reclass(){const e=this.Model(),t=[];return t.push("Item"),e.Is_Blank()?t.push("Blank"):(e.Is_Indented()&&t.push("Indented_Item"),e.Has_Italic_Style()&&t.push("Italic"),e.Has_Bold_Style()&&t.push("Bold"),e.Has_Underline_Style()&&t.push("Underline"),e.Has_Small_Caps_Style()&&t.push("Small_Caps"),(e.Is_Error()||e.Has_Error_Style())&&t.push("Error")),t}On_Restyle(){const e=this.Model();if(e.Is_Blank())return"";{const t=e.Override_Language_Name();return t?Model_Languages.Styles(t):""}}Model(){return this.model()}Segment(){return this.Parent()}Event_Grid_ID(){return this.Segment().Event_Grid_ID()}}