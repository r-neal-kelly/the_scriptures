import*as Utils from"../../../utils.js";import*as Languages from"../../languages.js";import*as Entity from"../../entity.js";export class Instance extends Entity.Instance{constructor({item:t,index:e,value:s,is_highlighted:i}){super(),this.item=t,this.index=e,this.value="",this.is_highlighted=i,null==s?(Utils.Assert(null==t,"item must be null."),Utils.Assert(null==e,"index must be null."),Utils.Assert(null==i,"is_highlighted must be null."),this.value=""):(Utils.Assert(null!=t,"item must not be null."),Utils.Assert(null!=e&&e>-1,"index must not be null, and must be greater than -1."),Utils.Assert(null!=i,"is_highlighted must not be null."),this.Set_Value(s)),this.Add_Dependencies([])}Item(){return Utils.Assert(null!=this.item,"Doesn't have item."),this.item}Index(){return Utils.Assert(null!=this.index,"Doesn't have an index."),this.index}Value(){if(this.Is_Blank())return"";if(this.Item().Segment().Line().Buffer().Is_Showing_Commands())return this.value;{const t=this.Item().Text();return t.Is_Part()&&t.Is_Command_Or_Argument()?"":this.value}}Set_Value(t){this.value=t.replace(/^ /," ").replace(/ $/," ").replace(/  /g,"  "),this.value=Languages.Adapt_Text_To_Default_Global_Font(this.Item().Language_Name(),this.value)}Is_Blank(){return null==this.item}Is_Highlighted(){return Utils.Assert(null!=this.is_highlighted,"Doesn't know if it's highlighted or not."),this.is_highlighted}Set_Highlight(t){Utils.Assert(null!=this.is_highlighted,"Can't know if it's highlighted or not."),this.is_highlighted=t}}