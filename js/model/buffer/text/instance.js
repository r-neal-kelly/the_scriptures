import*as Text from"../../text.js";import*as Text_Base from"../text_base.js";import*as Line from"./line.js";export class Instance extends Text_Base.Instance{constructor({default_language_name:e,default_font_name:t,override_font_name:n,text:a,allow_errors:r}){super({default_language_name:e,default_font_name:t,text:a}),this.override_font_name=n,r?this.Text().Set_Path_Type(Text.Path.Type.DEFAULT):this.Text().Set_Path_Type(Text.Path.Type.ERRORLESS);for(let e=0,t=a.Line_Count();e<t;e+=1)this.Push_Line(new Line.Instance({buffer:this,index:e,text:a.Line(e)}))}Override_Font_Name(e){return this.override_font_name(e)}Blank_Line(e){return new Line.Instance({buffer:this,index:e,text:null})}Allows_Errors(){return this.Text().Path_Type()===Text.Path.Type.DEFAULT}}