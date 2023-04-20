import*as Utils from"../../../utils.js";import*as Entity from"../../entity.js";export class Instance extends Entity.Instance{constructor({segment:t,index:e,text:s}){super(),this.segment=t,this.index=e,this.text=s,null==s?(Utils.Assert(null==t,"segment must be null."),Utils.Assert(null==e,"index must be null."),this.value=""):(Utils.Assert(null!=t,"segment must not be null."),Utils.Assert(null!=e&&e>-1,"index must not be null, and must be greater than -1."),s.Is_Part()&&s.Is_Command()?this.value="":this.value=s.Value().replace(/^ /," ").replace(/ $/," ").replace(/  /g,"  ")),this.Add_Dependencies([])}Segment(){return Utils.Assert(null!=this.segment,"Doesn't have segment."),this.segment}Index(){return Utils.Assert(null!=this.index,"Doesn't have an index."),this.index}Text(){return Utils.Assert(null!=this.text,"Doesn't have text."),this.text}Value(){return this.value}Part(){Utils.Assert(!this.Is_Blank(),"Item is blank and doesn't have a part.");const t=this.Text();return t.Is_Part()?t:t.Break()}Is_Blank(){return null==this.text}Is_Indented(){Utils.Assert(!this.Is_Blank(),"Item is blank and can't be indented.");const t=this.Part();return t.Is_Command()&&t.Is_Indent()}Is_Error(){return this.Part().Is_Error()}Has_Italic_Style(){return this.Part().Has_Italic_Style()}Has_Bold_Style(){return this.Part().Has_Bold_Style()}Has_Underline_Style(){return this.Part().Has_Underline_Style()}Has_Small_Caps_Style(){return this.Part().Has_Small_Caps_Style()}Has_Error_Style(){return this.Part().Has_Error_Style()}}