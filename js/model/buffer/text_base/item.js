import*as Utils from"../../../utils.js";import*as Entity from"../../entity.js";export class Instance extends Entity.Instance{constructor({segment:t,index:s,text:e}){super(),this.segment=t,this.index=s,this.text=e,null==t?(0,0):(0,0)}Is_Blank(){return null==this.text}Buffer(){return 0,this.Segment().Buffer()}Segment(){return 0,this.segment}Index(){return 0,this.index}Text(){return 0,this.text}Part(){0;const t=this.Text();return t.Is_Part()?t:t.Break()}Has_Image_Value(){return 0,this.Text().Has_Image_Value()}Is_Image_Value_Inline(){return 0,this.Text().Has_Image_Value()&&this.Text().Is_Image_Value_Inline()}Is_Indented(){0;const t=this.Part();return t.Is_Command()&&t.Is_Indent()}Is_Error(){return 0,this.Part().Is_Error()}Has_Italic_Style(){return 0,this.Part().Has_Italic_Style()}Has_Bold_Style(){return 0,this.Part().Has_Bold_Style()}Has_Underline_Style(){return 0,this.Part().Has_Underline_Style()}Has_Small_Caps_Style(){return 0,this.Part().Has_Small_Caps_Style()}Has_Error_Style(){return 0,this.Part().Has_Error_Style()}Has_Argument_Style(){return 0,this.Part().Has_Argument_Style()}Default_Language_Name(){return 0,this.Buffer().Default_Language_Name()}Override_Language_Name(){return 0,this.Part().Language()}Language_Name(){0;const t=this.Override_Language_Name();return null!=t?t:this.Default_Language_Name()}Default_Font_Name(){return 0,this.Buffer().Default_Font_Name()}Override_Font_Name(){0;const t=this.Override_Language_Name();return null!=t?this.Buffer().Override_Font_Name(t):null}Font_Name(){0;const t=this.Override_Font_Name();return null!=t?t:this.Default_Font_Name()}}