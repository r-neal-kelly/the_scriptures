import*as Entity from"../../entity.js";export class Instance extends Entity.Instance{constructor({segment:e,model:t}){super({element:"div",parent:e,event_grid:e.Event_Grid()}),this.model=t,this.Live()}On_Refresh(){this.Element().textContent=this.Model().Value()}On_Reclass(){const e=this.Model(),t=[];return t.push("Item"),e.Is_Blank()?t.push("Blank"):(e.Is_Indented()&&t.push("Indented_Item"),e.Has_Italic_Style()&&t.push("Italic"),e.Has_Bold_Style()&&t.push("Bold"),e.Has_Underline_Style()&&t.push("Underline"),e.Has_Small_Caps_Style()&&t.push("Small_Caps"),(e.Is_Error()||e.Has_Error_Style())&&t.push("Error"),e.Has_Argument_Style()&&t.push("Argument")),t}On_Restyle(){const e=this.Model();return e.Is_Blank()?"":e.Has_Override_Font_Styles()?e.Some_Override_Font_Styles():""}Model(){return this.model()}Segment(){return this.Parent()}Event_Grid_ID(){return this.Segment().Event_Grid_ID()}}