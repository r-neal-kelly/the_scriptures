import*as Utils from"../../../utils.js";import*as Languages from"../../languages.js";import*as Entity from"../../entity.js";import*as Division from"./division.js";export class Instance extends Entity.Instance{static Min_Division_Count(){return Instance.min_division_count}static Set_Min_Division_Count(i){Utils.Assert(i>=0,"min_division_count must be greater than or equal to 0."),Instance.min_division_count=i}constructor({segment:i,index:t,text:s}){super(),this.segment=i,this.index=t,this.text=s,this.divisions=[],null==s?(Utils.Assert(null==i,"segment must be null."),Utils.Assert(null==t,"index must be null.")):(Utils.Assert(null!=i,"segment must not be null."),Utils.Assert(null!=t&&t>-1,"index must not be null, and must be greater than -1."),this.divisions.push(new Division.Instance({item:this,index:0,value:this.Value(),is_highlighted:!1}))),this.Add_Dependencies([])}Segment(){return Utils.Assert(null!=this.segment,"Doesn't have segment."),this.segment}Index(){return Utils.Assert(null!=this.index,"Doesn't have an index."),this.index}Text(){return Utils.Assert(null!=this.text,"Doesn't have text."),this.text}Value(){return this.Is_Blank()?"":this.Text().Value()}Division_Count(){return this.divisions.length}Division_At(i){return Utils.Assert(i>-1,`division_index (${i}) must be greater than -1.`),i<this.Division_Count()?this.divisions[i]:Instance.blank_division}Highlight({first_unit_index:i,end_unit_index:t}){const s=this.Value();if(1===this.Division_Count())0===i&&t===s.length?this.Division_At(0).Set_Highlight(!0):0===i||t===s.length?0===i?(this.Division_At(0).Set_Value(s.slice(i,t)),this.Division_At(0).Set_Highlight(!0),this.divisions.push(new Division.Instance({item:this,index:1,value:s.slice(t,s.length),is_highlighted:!1}))):(this.Division_At(0).Set_Value(s.slice(0,i)),this.divisions.push(new Division.Instance({item:this,index:1,value:s.slice(i,t),is_highlighted:!0}))):(this.Division_At(0).Set_Value(s.slice(0,i)),this.divisions.push(new Division.Instance({item:this,index:1,value:s.slice(i,t),is_highlighted:!0})),this.divisions.push(new Division.Instance({item:this,index:2,value:s.slice(t,s.length),is_highlighted:!1})));else{const s=this.divisions;this.divisions=[];for(const i of s){const t=i.Is_Highlighted();for(const s of i.Value())this.divisions.push(new Division.Instance({item:this,index:this.divisions.length,value:s,is_highlighted:t}))}for(let s=i,e=t;s<e;s+=1)this.Division_At(s).Set_Highlight(!0)}}Part(){Utils.Assert(!this.Is_Blank(),"Item is blank and doesn't have a part.");const i=this.Text();return i.Is_Part()?i:i.Break()}Is_Blank(){return null==this.text}Is_Indented(){Utils.Assert(!this.Is_Blank(),"Item is blank and can't be indented.");const i=this.Part();return i.Is_Command()&&i.Is_Indent()}Is_Error(){return this.Part().Is_Error()}Has_Italic_Style(){return this.Part().Has_Italic_Style()}Has_Bold_Style(){return this.Part().Has_Bold_Style()}Has_Underline_Style(){return this.Part().Has_Underline_Style()}Has_Small_Caps_Style(){return this.Part().Has_Small_Caps_Style()}Has_Error_Style(){return this.Part().Has_Error_Style()}Override_Language_Name(){return this.Part().Language()}Is_Greek(){const i=this.Override_Language_Name();return null!=i?i===Languages.Name.GREEK:this.Segment().Line().Buffer().Default_Language_Name()===Languages.Name.GREEK}}Instance.min_division_count=1,Instance.blank_division=new Division.Instance({item:null,index:null,value:null,is_highlighted:null});